import dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Response, ErrorRequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import { categoryRouter, rootRouter, searchRouter, userRouter, watchListRouter } from './routes';
// var path = require('path');
// const authRouter = require('./routes/auth');
// const userRouter = require('./routes/user');
// const productRouter = require('./routes/product');

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

// app.use('/api/auth/', authRouter);
// app.use('/api/product/', productRouter);

app.use('/', rootRouter);
app.use('/api/user/', userRouter);
app.use('/api/search', searchRouter);
app.use('/api/category', categoryRouter);
app.use('/api/watch-list', watchListRouter);

// error handler
// app.get('/err', function (req, res) {
//   throw new Error('Error!');
// });

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

app.listen(PORT, function () {
  if (NODE_ENV === 'develop')
    console.log(`Server is listening at http://localhost:${PORT}`);
});
