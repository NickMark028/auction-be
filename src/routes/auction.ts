import express, { Request, Response } from 'express';

const router = express.Router();
const validate = require('../middleware/validate.mdw');
import auctionModel from '../models/auction';
const fs = require('fs');
//const schema = JSON.parse(fs.readFileSync('./src/schema/product.json'));
router.post('/', async (req, res) => {
  try {
    let auction = req.body;
    const ret = await auctionModel.auctionModel.add(auction);
    auction = {
      id: ret[0],
      ...auction,
    };

    res.status(201).json(auction);
  } catch (error) {
    res.send(error).status(401);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const auctionLog = await auctionModel.bidHistory(req.params.id);
    res.send(auctionLog).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

module.exports = router;
