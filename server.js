const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const BUILD_ID = 'REW-AUDIO-INTEGRATION-2026-10-22';

// Keep model assets inside public/assets and make the requested /assets/<file> URLs work.
app.get('/version', (_req, res) => res.type('text/plain').send(BUILD_ID));
app.get('/healthz', (_req, res) => res.json({ ok: true, version: BUILD_ID }));
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets'), {
  fallthrough: true,
  maxAge: '1h',
  etag: true
}));
app.use(express.static(__dirname, { index: false }));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));

const FIRMS = ['Elevate Realty','Nexus Real Estate','Vantage Realty','Vertex Properties','Northstar Realty','Haven Real Estate','UrbanEdge Realty','Momentum Realty','Blackstone Estates','Sterling Estates','Aurelia Realty','Park & Crown','Summit Estates','Bellmont Properties'];
const LIMIT = 48;
const AVATAR_IDS = new Set(['female1', 'female2', 'female3', 'female4', 'male1', 'male2', 'male3', 'male4']);
function cleanAvatar(id) { return AVATAR_IDS.has(String(id || '')) ? String(id) : 'female1'; }
const RANGES = { b: 3, s: 6, h: 6, hc: 6, j: 6, p: 4, o: 3 };
const players = {};
// Session rooms are kept server-side; the existing public city remains the default.
const rooms = new Map();
const PUBLIC_ROOM = 'public-city';
function cleanRoomCode(value) { return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8); }
function makeRoomCode() { let code; do { code = Math.random().toString(36).slice(2, 8).toUpperCase(); } while (rooms.has(code)); return code; }
function roomPlayers(roomId) { const out = {}; for (const id in players) if (players[id].roomId === roomId) out[id] = players[id]; return out; }
function roomSummary(room) { return { id: room.id, name: room.name, hostId: room.hostId, members: Object.keys(roomPlayers(room.id)).length, commission: room.commission || { type: 'equal', shares: [50, 50] }, teamGoals: !!room.teamGoals }; }
function leavePrivateRoom(playerId) { const p = players[playerId]; if (!p || !rooms.has(p.roomId)) return; const old = rooms.get(p.roomId); old.members.delete(playerId); if (!old.members.size) rooms.delete(old.id); else { if (old.hostId === playerId) old.hostId = old.members.values().next().value; io.to(old.id).emit('room:updated', roomSummary(old)); } }
function sendRoomState(roomId) { const state = {}; for (const id in players) if (players[id].roomId === roomId) state[id] = { x: players[id].x, z: players[id].z, ry: players[id].ry, n: players[id].n }; io.to(roomId).emit('state', state); }
function movePlayerToRoom(socket, roomId) { const p = players[socket.id]; if (!p) return; const oldRoom = p.roomId; if (oldRoom) { socket.leave(oldRoom); socket.to(oldRoom).emit('left', socket.id); } p.roomId = roomId; socket.join(roomId); socket.emit('init', { id: socket.id, players: roomPlayers(roomId), room: roomId === PUBLIC_ROOM ? { id: PUBLIC_ROOM, name: 'Public City', isPublic: true } : roomSummary(rooms.get(roomId)) }); socket.to(roomId).emit('joined', p); }

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function cleanLook(l = {}) {
  const o = {};
  for (const k in RANGES) o[k] = clamp(parseInt(l[k]) || 0, 0, RANGES[k] - 1);
  return o;
}

io.on('connection', (socket) => {
  socket.on('join', (d = {}) => {
    const name = String(d.name || 'Agent').trim().slice(0, 16) || 'Agent';
    const firm = FIRMS.includes(d.firm) ? d.firm : FIRMS[0];
    const existing = players[socket.id];
    players[socket.id] = { ...(existing || {}), id: socket.id, name, firm, look: cleanLook(d.look), avatar: cleanAvatar(d.avatar), skinTone: 'original', outfitColor: 'original', hairColor: 'original', x: existing?.x ?? (Math.random() - 0.5) * 6, z: existing?.z ?? 3 + Math.random() * 2, ry: existing?.ry ?? 0, n: 0, roomId: PUBLIC_ROOM };
    movePlayerToRoom(socket, PUBLIC_ROOM);
  });
  socket.on('room:create', (d = {}) => {
    const p = players[socket.id]; if (!p) return;
    const name = String(d.name || 'Team Room').trim().slice(0, 32) || 'Team Room';
    leavePrivateRoom(socket.id);
    const room = { id: makeRoomCode(), name, hostId: socket.id, commission: { type: 'equal', shares: [50, 50] }, teamGoals: !!d.teamGoals, members: new Set([socket.id]), createdAt: Date.now() };
    rooms.set(room.id, room); p.teamId = room.id; movePlayerToRoom(socket, room.id);
    socket.emit('room:created', roomSummary(room));
  });
  socket.on('room:join', (d = {}) => {
    const p = players[socket.id]; if (!p) return;
    const code = cleanRoomCode(d.code), room = rooms.get(code);
    if (!room) { socket.emit('room:error', { message: 'That private room could not be found.' }); return; }
    if (Object.keys(roomPlayers(code)).length >= 8 && !roomPlayers(code)[socket.id]) { socket.emit('room:error', { message: 'This room is full (8 agents maximum).' }); return; }
    if (p.roomId !== code) { leavePrivateRoom(socket.id); p.teamId = code; room.members.add(socket.id); movePlayerToRoom(socket, code); }
    io.to(code).emit('room:updated', roomSummary(room));
  });
  socket.on('room:public', () => { const p = players[socket.id]; if (!p) return; leavePrivateRoom(socket.id); p.teamId = null; movePlayerToRoom(socket, PUBLIC_ROOM); });
  socket.on('room:settings', (d = {}) => {
    const p = players[socket.id], room = p && rooms.get(p.roomId);
    if (!p || !room || room.hostId !== socket.id) return;
    const type = String(d.commissionType || 'equal');
    if (type === 'equal') room.commission = { type: 'equal', shares: [50, 50] };
    else if (type === 'lead') room.commission = { type: 'lead', shares: [60, 40] };
    else if (type === 'custom' && Number.isFinite(Number(d.leadShare)) && Number(d.leadShare) >= 1 && Number(d.leadShare) <= 99) room.commission = { type: 'custom', shares: [Number(d.leadShare), 100 - Number(d.leadShare)] };
    else return;
    room.teamGoals = !!d.teamGoals; io.to(room.id).emit('room:updated', roomSummary(room));
  });
  socket.on('move', (m = {}) => {
    const p = players[socket.id];
    if (!p) return;
    p.x = clamp(Number(m.x) || 0, -LIMIT, LIMIT);
    p.z = clamp(Number(m.z) || 0, -LIMIT, LIMIT);
    p.ry = Number(m.ry) || 0;
    p.n = clamp(parseInt(m.n) || 0, 0, 2);
  });
  socket.on('chat', (t) => {
    const p = players[socket.id];
    if (!p) return;
    t = String(t || '').trim().slice(0, 140);
    if (t) io.to(p.roomId || PUBLIC_ROOM).emit('chat', { id: socket.id, name: p.name, firm: p.firm, n: p.n, t });
  });
  socket.on('relay', (m = {}) => {
    const p = players[socket.id];
    if (!p || !players[m.to] || JSON.stringify(m.data || {}).length > 600) return;
    if (players[m.to].roomId !== p.roomId) return;
    io.to(m.to).emit('relay', { from: socket.id, name: p.name, type: String(m.type).slice(0, 20), data: m.data });
  });
  socket.on('disconnect', () => {
    const p = players[socket.id];
    if (p) { const roomId = p.roomId || PUBLIC_ROOM; if (rooms.has(roomId)) { const room = rooms.get(roomId); room.members.delete(socket.id); if (!room.members.size) rooms.delete(roomId); else { if (room.hostId === socket.id) room.hostId = room.members.values().next().value; io.to(roomId).emit('room:updated', roomSummary(room)); } } delete players[socket.id]; io.to(roomId).emit('left', socket.id); }
  });
});

setInterval(() => {
  const roomIds = new Set([PUBLIC_ROOM, ...rooms.keys()]);
  for (const roomId of roomIds) sendRoomState(roomId);
}, 66);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`RealEstate World running on port ${PORT} (${BUILD_ID})`));
