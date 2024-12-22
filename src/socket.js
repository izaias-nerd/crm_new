const { v4: uuidv4 } = require('uuid');

const clients = {}; // Objeto para armazenar os clientes conectados

// Função para inicializar o Socket.IO
function initSocketIO(io) {
  io.on('connection', (socket) => {
    const clientId = uuidv4(); // Gera um ID único para o cliente
    clients[socket.id] = clientId; // Associa o ID ao socket.id
    console.log(`Cliente conectado: ${clientId}`);

    // Envia o ID do cliente para ele
    socket.emit('clientId', clientId);

    // Lida com mensagens de chat
    socket.on('chat message', (msg) => {
      const clientId = clients[socket.id];
      console.log(`Mensagem de ${clientId}: ${msg}`);

      // Envia a mensagem e o ID do cliente para todos os conectados
      io.emit('chat message', { clientId, msg });
    });

    // Lida com a desconexão do cliente
    socket.on('disconnect', () => {
      console.log(`Cliente desconectado: ${clients[socket.id]}`);
      delete clients[socket.id]; // Remove o cliente do objeto
    });
  });
}

module.exports = { initSocketIO };
