import express, { query, Request, Response } from 'express';
import { auth } from '../middleware';
import isSeller from '../middleware/isSeller.mdw';
import sellerModel from '../models/seller.model';
import sellerSchema from '../schema/seller.json';
import { TRequest } from '../types';
import db from '../utils/db';

const sellerRouter = express.Router();
sellerRouter.get('/', async (req, res) => {
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

//danh sách yêu cầu bid 1 sản phẩm
sellerRouter.get('/request-bid/:sellerId', async (req, res) => {
  try {
    const rawquery = `SELECT U.id as bidderId,U.firstName,U.lastName,P.name,P.id,AB.createdAt FROM product P, acceptbidder AB,user U where sellerid = ${req.params.sellerId} and P.id = AB.productId and AB.bidderId = U.id and AB.status = 1`;
    const [rows, fields] = await db.raw(rawquery);
    res.send(rows).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

//chấp nhận cho bid
sellerRouter.patch('/accept-bid', async (req, res) => {
  try {
    const rawquery = `update acceptbidder set status = 0 where productId = ${req.body.productId} and bidderId=${req.body.bidderId} `;
    const [rows, fields] = await db.raw(rawquery);
    res.send('accpterd').status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

sellerRouter.get('/:userId/:productId', async (req, res, next) => {
  try {
    const bidderId = parseInt(req.params['userId']);
    const productId = parseInt(req.params['productId']);
    const isSellerOfProduct = await sellerModel.isSellerOfProduct(productId, bidderId);
    res.json({
      isSellerOfProduct
    })
  } catch (error) {
    res.status(500).json({
      errorMsg: 'Server internal message'
    });
  }
})

export default sellerRouter;
