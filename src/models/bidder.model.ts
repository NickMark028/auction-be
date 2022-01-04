import db from '../utils/db';
import generate from './generic.model';

const bidderDefaultModel = generate('bidderview', 'id');

async function detailBidder(id: any) {
  const rows = await db('bidder').where('id', id);
  if (rows.length === 0) {
    return rows.toString();
  }

  return rows[0];
}

async function changeRole(id: any) {
  const Role = await db('changeRoleLog').insert([
    {
      bidderId: id,
      statusCode: 100,
      message: 'Wanting to be a seller',
    },
  ]);

  if (Role.length === 0) {
    return Role.toString();
  }
  return Role[0];
}

const bidderModel = {
  ...bidderDefaultModel,
  detailBidder,
  changeRole,
};

export default bidderModel;
