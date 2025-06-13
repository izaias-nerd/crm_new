// src/socket.js
const { Server } = require('socket.io');

function initSocketIO(server) {
  const io = new Server(server); // Inicializa o Socket.IO com o servidor HTTP
io.on('connection', (socket) => {
  console.log('Um usuário se conectou');

  socket.on('register', (username) => {
    socket.username = username; // guarda username no socket
    console.log(`Usuário registrado: ${username}`);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', { username: socket.username || 'Anon', msg });
  });

  socket.on('disconnect', () => {
    console.log('Um usuário se desconectou');
  });
});
    return io; // Retorna a instância do Socket.IO
}

module.exports = { initSocketIO };
