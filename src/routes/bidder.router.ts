import express, { Request, Response } from 'express';
import bidderModel from '../models/bidder.model';
import db from '../utils/db';
const bidderRouter = express.Router();
//const schema = JSON.parse(fs.readFileSync('./src/schema/bidder.json'));

bidderRouter.get('/:id', async (req, res) => {
  try {
    const bidder = await bidderModel.findById(req.params.id);
    res.send(bidder).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

//sản phẩm tham gia đấu giá
bidderRouter.get('/product-bidded/:id', async (req, res) => {
  try {
    const rawquery = `
    select k1.*
    from (SELECT BV.* FROM auction.bidhistoryview BV where BV.bidderId = ${req.params.id} ) k1
    join
    (select max(price) as price from  auction.bidhistoryview B group by B.productId) k2
    on k1.price = k2.price;`;
    const [rows, fields] = await db.raw(rawquery);
    res.send(rows).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

export default bidderRouter;
