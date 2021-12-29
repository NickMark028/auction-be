import express, { NextFunction, Request, Response } from 'express';
import { categoryRouter } from './category';
import { searchRouter } from './search.router';

const rootRouter = express.Router();

/* GET home page. */
rootRouter.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.send('<h1>Hi<h1>');
});

export {
  rootRouter,
  categoryRouter,
  searchRouter
}
