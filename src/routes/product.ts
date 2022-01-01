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
    let product = await productModel.detailProduct(req.params.id);

    res.send(product).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});
//5sp cùng cate/ related
router.get('/related/:section', async (req, res) => {
  try {
    const pdrelated = await productModel.pb_related(req.params.section);
    res.send(pdrelated).status(201);
  } catch (error) {
    res.send(error).status(401);
  }
});

module.exports = router;
