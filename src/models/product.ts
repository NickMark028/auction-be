import db from '../utils/db';
import generate from '../models/generic.model';

const productModel = generate('product', 'id');

async function detailProduct(id: any) {
  const rows = await db('queryproductdetailview').where('id', id);
  if (rows.length === 0) {
    return rows.toString();
  }

  return rows[0];
}

//get 5 related product
async function pb_related(Section: any) {
  const rows = await db('queryproductview')
    .select(
      'name',
      'currentPrice',

      'createdAt',
      'timeExpired',
      'auctionLogCount',
      'coverImageURL'
    )
    .where('section', Section)
    .orderByRaw('RAND()')
    .limit(6);

  return rows;
}

export default {
  productModel,
  detailProduct,

  pb_related,
};
