import express, { Request, Response } from 'express';
import productodel from '../models/product';
import schema from '../schema/product.json'
import { validateBody } from '../middleware';
import db from '../utils/db';

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

productRouter.get('/top-near-end', async (req: Request, res: Response) => {
  try {
    const rawQuery = `
      SELECT		*
      FROM		  ProductView PV
      ORDER BY	TIME_TO_SEC(TIMEDIFF(NOW(), NOW() - INTERVAL 1 MONTH)) ASC
      LIMIT 		6;
    `;
    const [rows, fields] = await db.raw(rawQuery);
    res.status(200).json(rows);
  }
  catch (error) {
    res.status(500).json({
      error: "Server internal error"
    })
  }
})

productRouter.get('/top-priciest', async (req: Request, res: Response) => {
  try {
    const rawQuery = `
      SELECT		*
      FROM	  	ProductView PV
      ORDER BY	IF(PV.currentPrice IS NULL, PV.reservedPrice, PV.currentPrice) DESC
      LIMIT 		6;
    `;
    const [rows, fields] = await db.raw(rawQuery);
    res.status(200).json(rows);
  }
  catch (error) {
    res.status(500).json({
      error: "Server internal error"
    })
  }
})

productRouter.get('/top-auction-log', async (req: Request, res: Response) => {
  try {
    const rawQuery = `
      SELECT		*
      FROM	  	ProductView PV
      ORDER BY	PV.auctionLogCount DESC
      LIMIT 		6;
    `;
    const [rows, fields] = await db.raw(rawQuery);
    res.status(200).json(rows);
  }
  catch (error) {
    res.status(500).json({
      error: "Server internal error"
    })
  }
})

export default productRouter;
