import express, { Request, Response } from 'express';

const router = express.Router();
const validate = require('../middleware/validate.mdw');
import productModel from '../models/product';
const fs = require('fs');
const schema = JSON.parse(fs.readFileSync('./src/schema/product.json'));
router.post(
  '/',
  validate(schema),
  async function (req: Request, res: Response) {
    let product = req.body;
    let ret = null;
    try {
      ret = await productModel.productModel.add(product);
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

router.get('/:id', async (req, res) => {
  try {
    const product = await productModel.detailProduct(req.params.id);
    res.send(product).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

router.get('/detailproduct/:id', async (req, res) => {
  try {
    const product_img = await productModel.detailProduct_img(req.params.id);
    let product = await productModel.detailProduct(req.params.id);
    product = { ...product, productimg0: product_img[0].url };
    product = { ...product, productimg1: product_img[1].url };
    product = { ...product, productimg2: product_img[2].url };
    res.send(product).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});
//5sp cùng cate

module.exports = router;
