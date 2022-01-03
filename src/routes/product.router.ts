import express, { Request, Response } from 'express';
import productmodel from '../models/product.model';
import schema from '../schema/product.json';
import { validateBody } from '../middleware';
import db from '../utils/db';
import productModel from '../models/product.model';
const multer  = require('multer')
const productRouter = express.Router();
const upload = multer();
productRouter.post(
  '/',
 upload.none(),
  async function (req: Request, res: Response) {
    let product = req.body;
    // try {
    //   const ret = await productmodel.add(product);
    //   product = {
    //     id: ret[0],
    //     ...product,
    //   };

    //   return res.status(200).json(product);
    // } catch (err) {
    //   return res.status(401).json({ error: err });
    // }
    const formData = req.body;
    console.log('form data', formData);
  
    
    return res.status(201)
  }
);

productRouter.get('/top-near-end', async (req: Request, res: Response) => {
  try {
    const rawQuery = `
      SELECT		*
      FROM		  ProductView PV
      ORDER BY	TIME_TO_SEC(TIMEDIFF(NOW(), NOW() - INTERVAL 1 MONTH)) ASC
      LIMIT 		8;
    `;
    const [rows, fields] = await db.raw(rawQuery);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      error: 'Server internal error',
    });
  }
});

productRouter.get('/top-priciest', async (req: Request, res: Response) => {
  try {
    const rawQuery = `
      SELECT		*
      FROM	  	ProductView PV
      ORDER BY	IF(PV.currentPrice IS NULL, PV.reservedPrice, PV.currentPrice) DESC
      LIMIT 		8;
    `;
    const [rows, fields] = await db.raw(rawQuery);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      error: 'Server internal error',
    });
  }
});

productRouter.get('/top-auction-log', async (req: Request, res: Response) => {
  try {
    const rawQuery = `
      SELECT		*
      FROM	  	ProductView PV
      ORDER BY	PV.auctionLogCount DESC
      LIMIT 		8;
    `;
    const [rows, fields] = await db.raw(rawQuery);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      error: 'Server internal error',
    });
  }
});

productRouter.post(
  '/',
  // validate(schema),
  async function (req: Request, res: Response) {
    let product = req.body;
    let ret = null;
    try {
      ret = await productModel.add(product);
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

productRouter.get('/:id', async (req, res) => {
  try {
    const product = await productModel.detailProduct(req.params.id);
    res.send(product).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

productRouter.get('/detailproduct/:id', async (req, res) => {
  try {
    const product = await productModel.detailProduct(req.params.id);
    res.send(product).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

//5sp cùng cate/ related
productRouter.get('/related/:section', async (req, res) => {
  try {
    const pdrelated = await productModel.pb_related(req.params.section);
    res.send(pdrelated).status(201);
  } catch (error) {
    res.send(error).status(401);
  }
});
productRouter.get('/topbidder/:id', async (req, res) => {
  try {
    const rawQuery = `
    select * from bidhistoryview where price = (select max(price) from bidhistoryview)
    `;
    const [rows, fields] = await db.raw(rawQuery);
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({
      error: 'Server internal error',
    });
  }
});

productRouter.get('/',async (req, res) => {
  try {
    const product = await productModel.findAll();
    res.send(product).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }

})
export default productRouter;
