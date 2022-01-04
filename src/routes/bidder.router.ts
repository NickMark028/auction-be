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
    select k1.price,k3.*
    from (SELECT BV.* FROM auction.bidhistoryview BV where BV.bidderId = ${req.params.id} ) k1
    join
    (select max(price) as price from  auction.bidhistoryview B group by B.productId) k2
    on k1.price = k2.price
    join (select V.* from queryproductview V,auction.bidhistoryview BV2 where V.id = BV2.productId group by V.id ) k3
    group by id`;
    const [rows, fields] = await db.raw(rawquery);
    res.send(rows).status(201);
  } catch (err) {
    return res.status(401).json({ error: err });
  }
});

//Yêu cầu được thành seller
bidderRouter.post('/changeRole/:id', async (req, res) => {
  try {
    const change = await bidderModel.changeRole(req.params.id);
    res.status(201).send('request successfull!');
  } catch (error) {
    res.send(error).status(401);
  }
});

bidderRouter.patch('/cancelRole/:id', async (req, res) => {
  try {
    const rawquery = `
    update auction.changerolelog set statusCode= 300 where bidderId = ${req.params.id}
    `;
    await db.raw(rawquery);
    res.status(201).send('cancel successfull!');
  } catch (error) {
    res.send(error).status(401);
  }
});
export default bidderRouter;
