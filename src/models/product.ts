import db from '../utils/db';
import generate from '../models/generic.model';

const productModel = generate('product', 'id');

async function detailProduct(id: any) {
  const rows = await db('DetailProduct').where('id', id);
  if (rows.length === 0) {
    return rows.toString();
  }

  return rows[0];
}

async function detailProduct_img(id: any) {
  const rows = await db('productimage').where('productId', id);
  if (rows.length === 0) {
    return rows.toString();
  }

  return rows;
}

export default { productModel, detailProduct, detailProduct_img };
