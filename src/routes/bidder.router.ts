import express, { Request, Response } from 'express';
import bidderModel from '../models/bidder.model';

const bidderRouter = express.Router();
//const schema = JSON.parse(fs.readFileSync('./src/schema/bidder.json'));

bidderRouter.get('/:id', async (req, res) => {
  try {
    const bidder = await bidderModel.findById(req.params.id);
    res.send(bidder).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

export default bidderRouter;
