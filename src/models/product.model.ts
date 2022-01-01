import generate from './generic.model';
import db from '../utils/db';

const productDefaultModel = generate('product', 'id');

async function detailProduct(id: any) {
  const rows = await db('queryproductdetailview').where('id', id);
  if (rows.length === 0) {
    return rows.toString();
  }

  return rows[0];
}

//get 6 related products
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

const productModel = {
  ...productDefaultModel,
  detailProduct,
  pb_related,
};

export default productModel;
