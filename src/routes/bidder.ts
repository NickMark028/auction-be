import express, { Request, Response } from 'express';

const router = express.Router();
const validate = require('../middleware/validate.mdw');
import bidderModel from '../models/bidder';
const fs = require('fs');
//const schema = JSON.parse(fs.readFileSync('./src/schema/bidder.json'));

router.get('/:id', async (req, res) => {
  try {
    const bidder = await bidderModel.bidderModel.findById(req.params.id);
    res.send(bidder).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

module.exports = router;
