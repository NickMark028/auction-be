import db from '../utils/db';
import generate from './generic.model';

const bidderDefaultModel = generate('bidderview', 'id');

async function detailBidder(id: any) {
  const rows = await db('bidder').where('id', id);
  if (rows.length === 0) {
    return rows.toString();
  }

  return rows[0];
}

const bidderModel = {
  ...bidderDefaultModel,
  detailBidder,
};

export default bidderModel;
