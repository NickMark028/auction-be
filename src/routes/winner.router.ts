import express, { query, Request, Response } from 'express';

import db from '../utils/db';
import nodemailer from 'nodemailer';
const winnerRouter = express.Router();
import generate from '../models/generic.model';

const biddedproduct = generate('biddedproduct', 'id');
winnerRouter.patch('/mark-sent/:id_product', async (req, res) => {
  try {
    await biddedproduct.patch(req.params.id_product, { statusCode: 210 });
  
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

export default winnerRouter;
