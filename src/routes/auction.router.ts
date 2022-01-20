import express from 'express';
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
    // if (error.msg == 'The price must be a minimum of the product reserved price')
    //   res.status(400).send('The price must be a minimum of the product reserved price');
    // else
    res.status(500).send('Server internal error');
    console.log(error)
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
