const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
   app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

const FIRMS = ['Vantage Realty', 'Haven & Co.', 'Sterling Estates', 'Northstar Realty', 'Cornerstone Realty', 'Elevate Properties'];
const LIMIT = 48;
const players = {};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

io.on('connection', (socket) => {
  socket.on('join', (d = {}) => {
    const name = String(d.name || 'Agent').trim().slice(0, 16) || 'Agent';
    const firm = FIRMS.includes(d.firm) ? d.firm : FIRMS[0];
    players[socket.id] = { id: socket.id, name, firm, x: (Math.random() - 0.5) * 8, z: 3 + Math.random() * 3, ry: 0 };
    socket.emit('init', { id: socket.id, players });
    socket.broadcast.emit('joined', players[socket.id]);
  });
  socket.on('move', (m = {}) => {
    const p = players[socket.id];
    if (!p) return;
    p.x = clamp(Number(m.x) || 0, -LIMIT, LIMIT);
    p.z = clamp(Number(m.z) || 0, -LIMIT, LIMIT);
    p.ry = Number(m.ry) || 0;
  });
  socket.on('disconnect', () => {
    if (players[socket.id]) { delete players[socket.id]; io.emit('left', socket.id); }
  });
});

setInterval(() => io.emit('state', players), 66);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('RealEstate World running on port ' + PORT));
