import express, { NextFunction, Request, Response } from 'express';
import authRouter from './auth.router';
import categoryRouter from './category.router';
import productRouter from './product.router';
import searchRouter from './search.router';
import userRouter from './user.router';
import watchListRouter from './watchList.router';

const rootRouter = express.Router();

/* GET home page. */
rootRouter.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.send('<h1>Hi<h1>');
});

export {
  rootRouter, authRouter, categoryRouter,
  searchRouter, productRouter, userRouter,
  watchListRouter
};
