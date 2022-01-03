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

//get 8 related products
async function pb_related(Section: any) {
  const rows = await db('queryproductview')
    // .select(
    //   'name',
    //   'currentPrice',
    //   'createdAt',
    //   'timeExpired',
    //   'auctionLogCount',
    //   'coverImageUrl'
    // )
    .where('section', Section)
    .orderByRaw('RAND()')
    .limit(8);

  return rows;
}

const productModel = {
  ...productDefaultModel,
  detailProduct,
  pb_related,
};

export default productModel;
