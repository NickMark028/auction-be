import db from '../utils/db';
import generate from '../models/generic.model';

let productModel = generate('product', 'id');

async function detailProduct(id: any) {
  const rows = await db('ProductView').where('id', id);
  if (rows.length === 0) {
    return rows.toString();
  }

  return rows[0];
}
export default { productModel, detailProduct };
