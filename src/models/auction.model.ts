import db from '../utils/db';
import generate from './generic.model';

const auctionDefaultModel = generate('auctionlog', 'id');

async function bidHistory(id: any) {
  const rows = await db('auctionlog').where('productId', id);
  if (rows.length === 0) {
    return rows.toString();
  }

  return rows;
}

const auctionModel = {
  ...auctionDefaultModel,
  bidHistory,
};

export default auctionModel;
