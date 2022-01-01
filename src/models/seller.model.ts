import db from '../utils/db';
import generate from './generic.model';

const sellerDefaultModel = generate('sellerview', 'id');

async function detailSeller(id: any) {
  const rows = await db('seller').where('id', id);
  if (rows.length === 0) {
    return rows.toString();
  }

  return rows[0];
}

const sellerModel = {
  ...sellerDefaultModel,
  detailSeller,
};

export default sellerModel;
