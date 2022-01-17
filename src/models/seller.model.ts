import db from '../utils/db';
import generate from './generic.model';

const sellerDefaultModel = generate('sellerview', 'id');
const seller = generate('seller', 'id')
async function detailSeller(id: any) {
  const rows = await db('seller').where('id', id);
  if (rows.length === 0) {
    return rows.toString();
  }

  return rows[0];
}
async function findseller(id: any) {
  return seller.findById(id)
}
async function isSellerOfProduct(productId: number, bidderId: number) {
  const rawQuery = `
    SELECT	1
    FROM	  Seller S
    JOIN	  Product P ON P.sellerId = S.id
    WHERE	  P.id = ? AND S.id = ?
    LIMIT	  1;
  `
  const [row, fields] = await db.raw(rawQuery, [productId, bidderId]);
  return row.length === 1;
}

const sellerModel = {
  ...sellerDefaultModel,
  detailSeller,
  findseller,
  isSellerOfProduct
};

export default sellerModel;
