import generate from './generic.model';
import db from '../utils/db';

const productDefaultModel = generate('product', 'id');
const productImage = generate('productimage', 'id');
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
async function addimage(id:any,url:any) {
  const rows = await db('productimage').insert({productId:id,url:url});
  return rows
}
async function addBidded(id:any,cur:any) {
  const rows = await db('biddedproduct').insert({id:id,currentPrice:cur});
}
async function addCategory(id:any,id_cate:any) {
  const rows = await db('productcategory').insert({productId:id,categoryId:id_cate});
  return rows
}

async function deleteimage(id:any) {
  const rows = await db('productimage').where({productId:id}).del();
  return rows
}
async function deleteBidded(id:any) {
  const rows = await db('biddedproduct').where({id:id}).del();
}
async function deleteCategory(id:any) {
  const rows = await db('productcategory').where({productId:id}).del();
  return rows
}

async function updateDescription(id:any,des:any){
  const rows:any = await db('product').select('description').where('id',id)
  const rows1 = await db('product').where('id',id).update('description',rows[0].description+des)
  console.log(rows)
  return rows1
}
const productModel = {
  ...productDefaultModel,
  detailProduct,
  pb_related,
  addimage,
  addBidded,
  addCategory,
  updateDescription,
  deleteBidded,
  deleteCategory,
  deleteimage
};

export default productModel;
