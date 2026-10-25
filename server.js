const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const BUILD_ID = 'REW-TEAM-PUBLIC-CITY-FIX-2026-10-25';

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
// Session rooms are kept server-side. Team membership is separate from the player's current scene.
const rooms = new Map();
const PUBLIC_ROOM = 'public-city';
function cleanRoomCode(value) { return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8); }
function makeRoomCode() { let code; do { code = Math.random().toString(36).slice(2, 8).toUpperCase(); } while (rooms.has(code)); return code; }
function roomPlayers(roomId) { const out = {}; for (const id in players) if (players[id].roomId === roomId) out[id] = players[id]; return out; }
function roomSummary(room) { const members = [...room.members].map(id => players[id]).filter(p => p && p.teamId === room.id); return { id: room.id, name: room.name, hostId: room.hostId, members: members.length, agents: members.map(p => p.name), commission: room.commission || { type: 'equal', shares: [50, 50] }, teamGoals: !!room.teamGoals, teamDealsClosed: room.teamDealsClosed || 0 }; }
function leavePrivateRoom(playerId) { const p = players[playerId]; const oldId = p && p.teamId; if (!p || !oldId || !rooms.has(oldId)) return; const old = rooms.get(oldId); old.members.delete(playerId); if (!old.members.size) rooms.delete(old.id); else { if (old.hostId === playerId) old.hostId = old.members.values().next().value; io.to(old.id).emit('room:updated', roomSummary(old)); } }
function sendRoomState(roomId) { const state = {}; for (const id in players) if (players[id].roomId === roomId) state[id] = { x: players[id].x, z: players[id].z, ry: players[id].ry, n: players[id].n }; io.to(roomId).emit('state', state); }
function movePlayerToRoom(socket, roomId) { const p = players[socket.id]; if (!p) return; const oldRoom = p.roomId; if (oldRoom) { socket.leave(oldRoom); socket.to(oldRoom).emit('left', socket.id); } p.roomId = roomId; socket.join(roomId); const room = roomId === PUBLIC_ROOM ? { id: PUBLIC_ROOM, name: 'Public City', isPublic: true } : roomSummary(rooms.get(roomId)); socket.emit('init', { id: socket.id, players: roomPlayers(roomId), room, team: p.teamId && rooms.has(p.teamId) ? roomSummary(rooms.get(p.teamId)) : null }); socket.to(roomId).emit('joined', p); }

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
    players[socket.id] = { ...(existing || {}), id: socket.id, name, firm, look: cleanLook(d.look), avatar: cleanAvatar(d.avatar), skinTone: 'original', outfitColor: 'original', hairColor: 'original', x: existing?.x ?? (Math.random() - 0.5) * 6, z: existing?.z ?? 3 + Math.random() * 2, ry: existing?.ry ?? 0, n: 0, roomId: PUBLIC_ROOM, teamId: existing?.teamId || null };
    const p = players[socket.id];
    let targetRoomId = p.teamId && rooms.has(p.teamId) ? p.teamId : PUBLIC_ROOM;
    let createdRoom = null, joinedRoom = null;
    const requestedTeamName = String(d.createTeamName || '').trim().slice(0, 32);
    const requestedCode = cleanRoomCode(d.teamCode);
    if (requestedTeamName) {
      leavePrivateRoom(socket.id);
      createdRoom = { id: makeRoomCode(), name: requestedTeamName || 'My Team', hostId: socket.id, commission: { type: 'equal', shares: [50, 50] }, teamGoals: false, teamDealsClosed: 0, deals: new Set(), listings: new Map(), members: new Set([socket.id]), createdAt: Date.now() };
      rooms.set(createdRoom.id, createdRoom); p.teamId = createdRoom.id; targetRoomId = createdRoom.id;
    } else if (requestedCode) {
      const requestedRoom = rooms.get(requestedCode);
      if (!requestedRoom) {
        socket.emit('room:error', { message: 'That private team code could not be found.' });
      } else {
        const memberCount = [...requestedRoom.members].filter(id => players[id] && players[id].teamId === requestedCode).length;
        if (memberCount >= 8 && p.teamId !== requestedCode) {
          socket.emit('room:error', { message: 'This team is full (8 agents maximum).' });
        } else {
          if (p.teamId !== requestedCode) leavePrivateRoom(socket.id);
          p.teamId = requestedCode; requestedRoom.members.add(socket.id); joinedRoom = requestedRoom; targetRoomId = requestedCode;
        }
      }
    }
    // If a code was supplied but invalid/full, keep a still-valid existing team or use Public City.
    if (p.teamId && rooms.has(p.teamId) && !createdRoom && !joinedRoom) targetRoomId = p.teamId;
    else if (!p.teamId || !rooms.has(p.teamId)) targetRoomId = PUBLIC_ROOM;
    movePlayerToRoom(socket, targetRoomId);
    if (createdRoom) socket.emit('room:created', roomSummary(createdRoom));
    if (joinedRoom) { io.to(joinedRoom.id).emit('room:updated', roomSummary(joinedRoom)); if (joinedRoom.listings) for (const listing of joinedRoom.listings.values()) socket.emit('team:listing:sync', listing); }
    io.emit('agents:online', Object.keys(players).length);
  });
  socket.on('room:create', (d = {}) => {
    const p = players[socket.id]; if (!p) return;
    const name = String(d.name || 'Team Room').trim().slice(0, 32) || 'Team Room';
    leavePrivateRoom(socket.id);
    const room = { id: makeRoomCode(), name, hostId: socket.id, commission: { type: 'equal', shares: [50, 50] }, teamGoals: !!d.teamGoals, teamDealsClosed: 0, deals: new Set(), listings: new Map(), members: new Set([socket.id]), createdAt: Date.now() };
    rooms.set(room.id, room); p.teamId = room.id; movePlayerToRoom(socket, room.id);
    socket.emit('room:created', roomSummary(room));
  });
  socket.on('room:join', (d = {}) => {
    const p = players[socket.id]; if (!p) return;
    const code = cleanRoomCode(d.code), room = rooms.get(code);
    if (!room) { socket.emit('room:error', { message: 'That private room could not be found.' }); return; }
    const teamMemberCount = [...room.members].filter(id => players[id] && players[id].teamId === code).length;
    if (teamMemberCount >= 8 && p.teamId !== code) { socket.emit('room:error', { message: 'This team is full (8 agents maximum).' }); return; }
    if (p.teamId !== code) { leavePrivateRoom(socket.id); p.teamId = code; room.members.add(socket.id); }
    if (p.roomId !== code) movePlayerToRoom(socket, code);
    io.to(code).emit('room:updated', roomSummary(room));
    if (room.listings) for (const listing of room.listings.values()) socket.emit('team:listing:sync', listing);
  });
  // Travel to Public City without removing the player from their private team.
  socket.on('room:public', () => { const p = players[socket.id]; if (!p) return; movePlayerToRoom(socket, PUBLIC_ROOM); const team = p.teamId && rooms.has(p.teamId) ? rooms.get(p.teamId) : null; if (team) io.to(team.id).emit('room:updated', roomSummary(team)); socket.emit('room:updated', team ? roomSummary(team) : { id: PUBLIC_ROOM, name: 'Public City', isPublic: true }); });
  // Team departure is a distinct, explicit action.
  socket.on('room:leave', () => { const p = players[socket.id]; if (!p) return; leavePrivateRoom(socket.id); p.teamId = null; movePlayerToRoom(socket, PUBLIC_ROOM); socket.emit('room:updated', { id: PUBLIC_ROOM, name: 'Public City', isPublic: true }); });
  // Share a team's active listing and buyer progress with every teammate in the same private room.
  socket.on('team:listing:sync', (d = {}) => {
    const p = players[socket.id], room = p && rooms.get(p.teamId);
    if (!p || !room || !room.members.has(socket.id) || !d || typeof d !== 'object') return;
    const ni = Number(d.ni), pi = Number(d.pi);
    if (!Number.isInteger(ni) || ni < 0 || ni > 20 || !Number.isInteger(pi) || pi < 0 || pi > 200) return;
    const payload = {
      ni, pi,
      profile: d.profile && typeof d.profile === 'object' ? d.profile : null,
      price: Number(d.price), rate: Number(d.rate),
      st: Number(d.st), buyers: Array.isArray(d.buyers) ? d.buyers.slice(0, 12) : [],
      fb: Array.isArray(d.fb) ? d.fb.slice(0, 20).map(x => String(x).slice(0, 300)) : [],
      mb: Number.isInteger(Number(d.mb)) ? Number(d.mb) : -1,
      done: !!d.done, lost: !!d.lost
    };
    if (!payload.profile || !Number.isFinite(payload.price) || payload.price < 0 ||
        !Number.isFinite(payload.rate) || payload.rate < 0 || payload.rate > 20 ||
        ![0, 1, 2, 3, 4, 5].includes(payload.st)) return;
    try { if (JSON.stringify(payload).length > 24000) return; } catch (_) { return; }
    if (!room.listings) room.listings = new Map();
    room.listings.set(ni + '-' + pi, payload);
    socket.to(room.id).emit('team:listing:sync', payload);
  });
  socket.on('room:settings', (d = {}) => {
    const p = players[socket.id], room = p && rooms.get(p.teamId);
    if (!p || !room || p.teamId !== room.id || room.hostId !== socket.id) return;
    const type = String(d.commissionType || 'equal');
    if (type === 'equal') room.commission = { type: 'equal', shares: [50, 50] };
    else if (type === 'lead') room.commission = { type: 'lead', shares: [60, 40] };
    else if (type === 'custom' && Number.isFinite(Number(d.leadShare)) && Number(d.leadShare) >= 1 && Number(d.leadShare) <= 99) room.commission = { type: 'custom', shares: [Number(d.leadShare), 100 - Number(d.leadShare)] };
    else return;
    room.teamGoals = !!d.teamGoals; io.to(room.id).emit('room:updated', roomSummary(room));
  });
  // Shared deal settlement: the server accepts each team listing close only once.
  socket.on('team:deal:close', (d = {}, ack = () => {}) => {
    const p = players[socket.id], room = p && rooms.get(p.teamId);
    if (!p || !room || !room.members.has(socket.id)) return ack({ ok: false, message: 'Join a private team room first.' });
    const members = [...room.members].filter(id => players[id] && players[id].teamId === room.id);
    if (members.length < 2) return ack({ ok: false, message: 'A teammate must be in the room to close a shared deal.' });
    const dealId = String(d.dealId || '').slice(0, 120);
    const price = Number(d.price), rate = Number(d.rate), rent = !!d.rent;
    const listing = String(d.listing || 'Property').slice(0, 100);
    if (!dealId || !Number.isFinite(price) || price <= 0 || price > 1000000000 ||
        !Number.isFinite(rate) || rate < 0 || rate > 20) {
      return ack({ ok: false, message: 'The deal details were invalid; nothing was closed.' });
    }
    if (!room.deals) room.deals = new Set();
    if (room.deals.has(dealId)) return ack({ ok: false, message: 'This team listing has already been closed.' });
    const gross = rent ? price * 12 * rate / 100 : price * rate / 100 * 0.5;
    const pool = Math.round(gross * 0.7);
    const shares = room.commission && Array.isArray(room.commission.shares) ? room.commission.shares : [50, 50];
    const hostShare = Math.max(1, Math.min(99, Number(shares[0]) || 50)) / 100;
    const payouts = {};
    const nonHostIds = members.filter(id => id !== room.hostId);
    payouts[room.hostId] = Math.round(pool * hostShare);
    const teammatePool = pool - payouts[room.hostId];
    const each = nonHostIds.length ? Math.floor(teammatePool / nonHostIds.length) : 0;
    let assigned = payouts[room.hostId];
    nonHostIds.forEach((id, index) => { payouts[id] = index === nonHostIds.length - 1 ? pool - assigned : each; assigned += payouts[id]; });
    room.deals.add(dealId);
    room.teamDealsClosed = (room.teamDealsClosed || 0) + 1;
    const result = { dealId, listing, price, rent, pool, payouts, closerId: socket.id, xp: 100,
      closerName: p.name, dealsClosed: room.teamDealsClosed, teamGoals: !!room.teamGoals };
    io.to(room.id).emit('team:deal:closed', result);
    ack({ ok: true, ...result, payout: payouts[socket.id] || 0 });
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
    if (p) { const currentRoomId = p.roomId || PUBLIC_ROOM; const teamId = p.teamId; if (teamId && rooms.has(teamId)) { const team = rooms.get(teamId); team.members.delete(socket.id); if (!team.members.size) rooms.delete(teamId); else { if (team.hostId === socket.id) team.hostId = team.members.values().next().value; io.to(teamId).emit('room:updated', roomSummary(team)); } } delete players[socket.id]; io.to(currentRoomId).emit('left', socket.id); io.emit('agents:online', Object.keys(players).length); }
  });
});

setInterval(() => {
  const roomIds = new Set([PUBLIC_ROOM, ...rooms.keys()]);
  for (const roomId of roomIds) sendRoomState(roomId);
}, 66);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`RealEstate World running on port ${PORT} (${BUILD_ID})`));
