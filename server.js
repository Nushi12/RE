const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

const FIRMS = ['Elevate Realty','Nexus Real Estate','Vantage Realty','Vertex Properties','Northstar Realty','Haven Real Estate','UrbanEdge Realty','Momentum Realty','Blackstone Estates','Sterling Estates','Aurelia Realty','Park & Crown','Summit Estates','Bellmont Properties'];
const LIMIT = 48;
const RANGES = { b: 3, s: 6, h: 6, hc: 6, j: 6, p: 4, o: 3 };   // avatar look option counts
const players = {};
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
    players[socket.id] = { id: socket.id, name, firm, look: cleanLook(d.look), x: (Math.random() - 0.5) * 6, z: 3 + Math.random() * 2, ry: 0, n: 0 };
    socket.emit('init', { id: socket.id, players });
    socket.broadcast.emit('joined', players[socket.id]);
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
    if (t) io.emit('chat', { id: socket.id, name: p.name, firm: p.firm, n: p.n, t });
  });
  socket.on('relay', (m = {}) => {
    const p = players[socket.id];
    if (!p || !players[m.to] || JSON.stringify(m.data || {}).length > 600) return;
    io.to(m.to).emit('relay', { from: socket.id, name: p.name, type: String(m.type).slice(0, 20), data: m.data });
  });
  socket.on('disconnect', () => {
    if (players[socket.id]) { delete players[socket.id]; io.emit('left', socket.id); }
  });
});

setInterval(() => {
  const s = {};
  for (const id in players) s[id] = { x: players[id].x, z: players[id].z, ry: players[id].ry, n: players[id].n };
  io.emit('state', s);
}, 66);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('RealEstate World running on port ' + PORT));
