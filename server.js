const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// GLB files can live in public/assets (recommended) or beside server.js (current GitHub layout).
const ASSET_DIR = path.join(__dirname, 'public', 'assets');
const ALLOWED_GLB = new Set(['human-base-rigged.glb', 'female-rigged-agent.glb']);
app.use('/assets', express.static(ASSET_DIR, { maxAge: '1d' }));
app.get('/assets/:filename', (req, res) => {
  const filename = path.basename(req.params.filename || '');
  if (!ALLOWED_GLB.has(filename)) return res.sendStatus(404);
  if (filename === 'female-rigged-agent.glb') {
    const compressedFile = path.join(ASSET_DIR, 'female-rigged-agent.glb.gz');
    if (!fs.existsSync(compressedFile)) return res.status(404).send('Avatar model not found: ' + filename);
    // The stored model is gzip-compressed to reduce the GitHub upload size.
    // Browsers transparently decompress Content-Encoding:gzip before GLTFLoader parses the GLB.
    res.set('Content-Type', 'model/gltf-binary');
    res.set('Content-Encoding', 'gzip');
    res.set('Cache-Control', 'public, max-age=3600, no-transform');
    return res.sendFile(compressedFile);
  }
  const publicFile = path.join(ASSET_DIR, filename);
  const rootFile = path.join(__dirname, filename);
  const file = fs.existsSync(publicFile) ? publicFile : rootFile;
  if (!fs.existsSync(file)) return res.status(404).send('Avatar model not found: ' + filename);
  res.set('Cache-Control', 'public, max-age=3600');
  res.sendFile(file);
});
app.get('/version', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.type('text/plain').send('REW-FEMALE-RIGGED-ANIM-2026-10-19');
});
app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok', build: 'REW-FEMALE-RIGGED-ANIM-2026-10-19' }));
app.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store, max-age=0');
  res.sendFile(path.join(__dirname, 'index.html'));
});

const FIRMS = ['Elevate Realty','Nexus Real Estate','Vantage Realty','Vertex Properties','Northstar Realty','Haven Real Estate','UrbanEdge Realty','Momentum Realty','Blackstone Estates','Sterling Estates','Aurelia Realty','Park & Crown','Summit Estates','Bellmont Properties'];
const LIMIT = 48;
const RANGES = { body: 2, height: 3, b: 3, face: 3, s: 6, h: 6, hc: 6, fh: 4, eye: 4, j: 6, p: 4, o: 4 }; // accepted customizable avatar choices
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
server.listen(PORT, () => console.log('RealEstate World REW-FEMALE-RIGGED-ANIM-2026-10-19 running on port ' + PORT));
