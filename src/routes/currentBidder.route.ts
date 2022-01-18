import express, { Request, Response } from 'express';
import { auth, validateBody } from '../middleware';
import isSeller from '../middleware/isSeller.mdw';
import currentBidderModel from '../models/currentBidder.model';
import blockedBidderSchema from '../schema/blockedBidder.json'
import { TCurrentBidder } from '../types/request';

const currentBidderRouter = express.Router();

currentBidderRouter.get('/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const currentBidders = await currentBidderModel.getBidders(productId);
    res.status(200).json(
      currentBidders
    );
  } catch (error) {
    res.status(500).json({
      error: error
    });
  }
});

// ------------------------------------------------------------------------------------ //
currentBidderRouter.patch('/', auth, isSeller, validateBody(blockedBidderSchema), async (req, res) => {
  try {
    const obj = req.body as TCurrentBidder;

    const affectedRows = await currentBidderModel.blockBidder(obj);

    res.status(200).json({
      affectedRows
    });
  } catch (error) {
    res.status(500).json({
      errorMsg: error
    });
  }
});

export default currentBidderRouter;
