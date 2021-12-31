import express, { Request, Response } from 'express';
import productodel from '../models/product';
import schema from '../schema/product.json'
import { validateBody } from '../middleware';

const productRouter = express.Router();

productRouter.post('/', validateBody(schema), async function (req: Request, res: Response) {
  let product = req.body;
  let ret = null;
  try {
    ret = await productodel.add(product);
    product = {
      id: ret[0],
      ...product,
    };

    return res.status(200).json(product);
  }
  catch (err) {
    return res.status(401).json({ error: err });
  }
});

export default productRouter;
