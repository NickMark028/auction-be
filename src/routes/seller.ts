import express, { Request, Response } from 'express';

const router = express.Router();
const validate = require('../middleware/validate.mdw');
import sellerModel from '../models/seller';
const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('./src/schema/seller.json'));

router.get('/:id', async (req, res) => {
  try {
    const seller = await sellerModel.sellerModel.findById(req.params.id);
    res.send(seller).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

module.exports = router;
