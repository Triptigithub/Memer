const { Server } = require('socket.io');
const supabase = require('../db/supabaseClient');

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    socket.on('join', () => {});
    socket.on('bidPlaced', (data) => {
      io.emit('bidUpdate', data);
    });
    socket.on('votePlaced', (data) => {
      io.emit('voteUpdate', data);
    });
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = initSocket;
