// ---------------------------------------------------------------------- //
// Configuration
import dotenv from 'dotenv';
dotenv.config();

// ---------------------------------------------------------------------- //
// Socket IO
import auctionRouter from './routes/auction.router';
// import httpServer from './socket';
import { createServer } from 'http';
import { Server } from 'socket.io';



//httpServer.listen(40567);

// ---------------------------------------------------------------------- //
// Express
import express, { ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import {
  authRouter,
  bidderRouter,
  blockedBidderRouter,
  categoryRouter,
  productRouter,
  rootRouter,
  searchRouter,
  sellerRouter,
  userRouter,
  watchListRouter,
} from './routes';
import adminRouter from './routes/admin.router';
import winnerRouter from './routes/winner.router';
import { auth } from './middleware';
import currentBidderRouter from './routes/currentBidder.route';
const app = express();


const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});
//dùng chung 1 io =>> nhiều socket cho mỗi kết nối

io.on('connection', (socket) => {
  console.log('conection' + socket.id);

  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnect');
  });

  //socket.emit('test', 'hello');

  socket.on(`bid`, (data) => {
    console.log(data);
    io.sockets.emit(`updatebid_${data.id_product}`, data); // thông báo lại cho toàn bộ những socket đang theo dõi
  });

  socket.on('request-bid', (data) => {
    console.log(data);
    //thông báo lại cho seller
    io.sockets.emit(`request-from-bidder`, data);
  });

  socket.on('accepted', (data) => {
    console.log(data);
    io.sockets.emit(`updatebtn_${data.Id}`, data);
  });
});




// view engine setup
// app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'public')));

// app.use(
//   cors({
//     origin: 'http://localhost:3001',
//     methods: 'GET,PATCH,POST,DELETE',
//   })
// );

app.use('/', rootRouter);
app.use('/api/auction', auctionRouter);
app.use('/api/auth', authRouter);
app.use('/api/bidder', bidderRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/user', userRouter);
app.use('/api/search', searchRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/watch-list', auth, watchListRouter);
app.use('/api/admin', adminRouter);
app.use('/api/winner', winnerRouter);
app.use('/api/current-bidder', currentBidderRouter);
// app.use('/api/blocked-bidder/', blockedBidderRouter);

// error handler
// app.get('/err', function (req, res) {
//   throw new Error('Error!');
// });

// app.get('/mail', auto_mail);
//auto gửi mail sau mỗi giấy
// setInterval(function () {
//   auto_mail_bidder();
//   auto_mail_seller_nothing(),
//   auto_mail_seller_sold()
// }, 5000);

app.use(function (req, res, next) {
  res.status(404).json({
    error: 'Endpoint not found',
  });
});

app.use(function (err, req, res, next) {
  if (NODE_ENV === 'develop') console.log(err.stack);

  res.status(500).json({
    error: 'Something broke!',
  });
} as ErrorRequestHandler);

const PORT = process.env.PORT || '4000';
const NODE_ENV = process.env.NODE_ENV;

httpServer.listen(PORT, function () {
  if (NODE_ENV === 'develop')
    console.log(`Server is listening at http://localhost:${PORT}`);
});
