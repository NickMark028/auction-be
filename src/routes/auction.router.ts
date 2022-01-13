import { log } from 'console';
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
    res.status(400).send(error);
  }
});

auctionRouter.get('/:id', async (req, res) => {
  try {
    const auctionLog = await auctionModel.bidHistory(req.params.id);
    res.status(200).send(auctionLog);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

export default auctionRouter;
