import express, { Request, Response } from 'express';

import validate from '../middleware/validateBody.mdw'
import productodel from '../models/product';
const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('./src/schema/product.json'));
const router = express.Router();

router.post(
  '/',
  validate(schema),
  async function (req: Request, res: Response) {
    let product = req.body;
    var ret = null;
    try {
      ret = await productodel.add(product);
    } catch (err) {
      return res.status(401).json({ error: err });
    }

    product = {
      id: ret[0],
      ...product,
    };

    return res.status(200).json(product);
  }
);

module.exports = router;
