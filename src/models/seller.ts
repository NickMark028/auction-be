import db from '../utils/db';
import generate from '../models/generic.model';

const sellerModel = generate('seller', 'id');

async function detailSeller(id: any) {
  const rows = await db('sellerView').where('id', id);
  if (rows.length === 0) {
    return rows.toString();
  }

  return rows[0];
}
export default { sellerModel, detailSeller };
