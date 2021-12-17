import express, { NextFunction, Response, ErrorRequestHandler } from 'express';
// var path = require('path');
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const sellerRouter = require('./routes/seller');
// var auth = require('./middleware/auth.mdw.js');

const app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api/auth/', authRouter);
app.use('/api/user/', userRouter);
app.use('/api/product/', productRouter);
app.use('/api/seller/', sellerRouter);
// error handler
app.get('/err', function (req, res) {
  throw new Error('Error!');
});

app.use(function (req, res, next) {
  res.status(404).json({
    error: 'Endpoint not found',
  });
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).json({
    error: 'Something broke!',
  });
} as ErrorRequestHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Auction API is listening at http://localhost:${PORT}`);
});
