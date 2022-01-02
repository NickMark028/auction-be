import express, { Request, Response } from 'express';
import sellerModel from '../models/seller.model';
import sellerSchema from '../schema/seller.json';

const sellerRouter = express.Router();

sellerRouter.get('/:id', async (req, res) => {
  try {
    const seller = await sellerModel.findById(req.params.id);
    res.send(seller).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

export default sellerRouter;
