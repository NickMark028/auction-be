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
    select k1.price,k1.productId,k3.*
    from (SELECT BV.* FROM bidhistoryview BV where BV.bidderId = ${req.params.id} ) k1
    join
    (select max(price) as price from  bidhistoryview B group by B.productId) k2
    on k1.price = k2.price
    join (select V.* from queryproductview V,bidhistoryview BV2 where V.id = BV2.productId  ) k3
    on k1.productid=k3.Id
    group by Id`;
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
    update changerolelog set statusCode= 300 where bidderId = ${req.params.id}
    `;
    await db.raw(rawquery);
    res.status(201).send('cancel successfull!');
  } catch (error) {
    res.send(error).status(401);
  }
});

bidderRouter.get('/score/:id', async (req, res) => {
  try {
    const score = await bidderModel.detailBidder(req.params.id);
    if (score == '') {
      return res.status(404).json({
        status: ' not found',
      });
    }
    return res.status(200).json({
      score: score.positiveCount - score.negativeCount,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'server error',
      error: error,
    });
  }
});

//xin được đấu giá nếu score == 0
bidderRouter.post('/request-bid', async (req, res) => {
  try {
    const request = await db('acceptbidder').insert({
      productId: req.body.productId,
      bidderId: req.body.bidderId,
    });
    res.status(201).send('request successfull!');
  } catch (error) {
    res.send(error).status(400);
  }
});
//check đã được seller chấp nhận chưa

export default bidderRouter;
