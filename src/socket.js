const { v4: uuidv4 } = require('uuid');

const registeredUsers = new Set(); // Conjunto para armazenar usuários registrados

// Função para inicializar o Socket.IO
function initSocketIO(io) {
  io.on('connection', (socket) => {
    let username = null; // Armazena o nome do usuário associado ao socket
    console.log(`Cliente conectado: ${socket.id}`);

    // Registro do usuário
    socket.on('register', (name) => {
      const trimmedName = name.trim();
      if (trimmedName) {
        username = trimmedName;
        registeredUsers.add(username);
        console.log(`Usuário registrado: ${username}`);
      } else {
        socket.emit('error', 'Nome inválido para registro.');
      }
    });

    // Verificação ao enviar mensagens
    socket.on('chat message', (msg) => {
      if (!username || !registeredUsers.has(username)) {
        socket.emit('error', 'Você não está registrado.');
        return;
      }
      console.log(`Mensagem de ${username} (${socket.id}): ${msg}`);
      io.emit('chat message', { username, msg }); // Envia a mensagem para todos os conectados
    });

    // Lida com a desconexão do cliente
    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${username || socket.id}`);
      if (username) {
        registeredUsers.delete(username); // Remove o usuário registrado
      }
    });
  });
}

module.exports = { initSocketIO };
