import express, { Request, Response } from 'express';
import auctionModel from '../models/auction.model';

const auctionRouter = express.Router();

auctionRouter.post('/', async (req, res) => {
  try {
    let auction = req.body;
    const ret = await auctionModel.add(auction);
    auction = {
      id: ret[0],
      ...auction,
    };

    res.status(201).json(auction);
  } catch (error) {
    res.send(error).status(401);
  }
});

auctionRouter.get('/:id', async (req, res) => {
  try {
    const auctionLog = await auctionModel.bidHistory(req.params.id);
    res.send(auctionLog).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

export default auctionRouter;
