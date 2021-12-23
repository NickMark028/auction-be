import db from '../utils/db';
import generate from '../models/generic.model';
import { randomBytes, randomInt } from 'crypto';

const productModel = generate('product', 'id');

async function detailProduct(id: any) {
  const rows = await db('DetailProduct2').where('id', id);
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

//get 5 related product
async function pb_related(categoryId: any) {
  const rows = await db('productcategory')
    .select('productId')
    .where('categoryId', categoryId)
    .orderByRaw('RAND()')
    .limit(5);

  return rows;
}

//5 sp luợt ra giá cao nhất
async function pb_highestPrice() {
  const rows = await db('detailproduct')
    .orderBy('auctionLogCount', 'desc')
    .limit(5);
  return rows;
}
//5sp gần kế thúc
async function pb_remainest() {
  const rows = await db('detailproduct').orderBy('timeExpired', 'asc').limit(5);
  return rows;
}
//5 sp gía cao nhất
async function pb_mostExpensive() {
  const rows = await db('detailproduct')
    .orderBy('currentPrice', 'asc')
    .limit(5);
  return rows;
}

export default {
  productModel,
  detailProduct,
  detailProduct_img,
  pb_related,
  pb_highestPrice,
  pb_mostExpensive,
  pb_remainest,
};
