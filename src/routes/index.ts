import express, { NextFunction, Request, Response } from 'express';
import auctionRouter from './auction.router';
import authRouter from './auth.router';
import bidderRouter from './bidder.router';
import currentBidderRouter from './currentBidder.route';
import categoryRouter from './category.router';
import productRouter from './product.router';
import searchRouter from './search.router';
import sellerRouter from './seller.route';
import userRouter from './user.router';
import watchListRouter from './watchList.router';
import blockedBidderRouter from './blockedBidder.router';
const rootRouter = express.Router();

/* GET home page. */
rootRouter.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.send('<h1>Hi<h1>');
});


export {
  rootRouter,
  auctionRouter,
  authRouter,
  bidderRouter,
  currentBidderRouter,
  categoryRouter,
  productRouter,
  searchRouter,
  sellerRouter,
  userRouter,
  watchListRouter,
  blockedBidderRouter
};
