import db from '../utils/db';
import generate from '../models/generic.model';

const auctionModel = generate('auctionlog', 'id');
async function bidHistory(id: any) {
  const rows = await db('auctionlog').where('productId', id);
  if (rows.length === 0) {
    return rows.toString();
  }

  return rows;
}

export default { auctionModel, bidHistory };
