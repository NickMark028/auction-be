import express, { query, Request, Response } from 'express';

import db from '../utils/db';

const winnerRouter = express.Router();

winnerRouter.get('/winner-email', async (req, res) => {
  try {
    const rawquery = `SELECT U.email FROM auction.queryproductdetailview B, user U where B.topBidderId = U.id and B.timeExpired < (select now())`;
    const [rows, fields] = await db.raw(rawquery);
    res.send(rows).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

export default winnerRouter;
