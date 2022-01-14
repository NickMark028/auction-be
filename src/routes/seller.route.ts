import express, { query, Request, Response } from 'express';
import sellerModel from '../models/seller.model';
import sellerSchema from '../schema/seller.json';
import db from '../utils/db';

const sellerRouter = express.Router();
sellerRouter.get('/',async (req, res) => {
  try {
    const seller = await sellerModel.findAll();
    res.send(seller).status(201);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
})
sellerRouter.get('/:id', async (req, res) => {
  try {
    const seller = await sellerModel.findById(req.params.id);
    res.send(seller).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

sellerRouter.get('/allproduct/:id', async (req, res) => {
  try {
    const rawquery = `SELECT * FROM queryproductview where sellerId=${req.params.id}`;
    const [rows, fields] = await db.raw(rawquery);
    res.send(rows).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

sellerRouter.get('/product-selling/:id', async (req, res) => {
  try {
    const rawquery = `SELECT * FROM queryproductview where sellerId=${req.params.id} and timeExpired > (select now())`;
    const [rows, fields] = await db.raw(rawquery);
    res.send(rows).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

sellerRouter.get('/checkrole/:id', async (req, res) => {
  try {
    const rawquery = `SELECT * FROM seller where id=${req.params.id} and active = 1`;
    const [rows, fields] = await db.raw(rawquery);
    res.send(rows[0]).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});
export default sellerRouter;
