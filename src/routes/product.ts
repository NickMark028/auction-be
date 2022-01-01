import express, { Request, Response } from 'express';

import validate from '../middleware/validateBody.mdw'
import productodel from '../models/product';
const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('./src/schema/product.json'));
const producrouter = express.Router();

producrouter.post(
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
producrouter.get(
  '/',
  validate(schema),
  async function (req: Request, res: Response) {
    var ret = null;
    try {
      ret = await productodel.findAll();
    } catch (err) {
      return res.status(401).json({ error: err });
    }

   

    return res.status(200).json(ret);
  }
);
export default producrouter;
