import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  // options
});
//dùng chung 1 io =>> nhiều socket cho mỗi kết nối

io.on('connection', (socket) => {
  console.log('conection' + socket.id);

  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnect');
  });

  //socket.emit('test', 'hello');
  socket.on('bid', (data) => {
    console.log(data);
    io.sockets.emit('test', data); // thông báo lại cho toàn bộ những socket đang theo dõi
  });
});

httpServer.listen(40567);
console.log('this server socket');

export default httpServer;
