import db from '../utils/db';
import generate from './generic.model';

const sellerDefaultModel = generate('sellerview', 'id');
const seller =generate('seller','id')
async function detailSeller(id: any) {
  const rows = await db('seller').where('id', id);
  if (rows.length === 0) {
    return rows.toString();
  }

  return rows[0];
}
async function findseller(id:any){
  return seller.findById(id)
}
const sellerModel = {
  ...sellerDefaultModel,
  detailSeller,
  findseller
};

export default sellerModel;
