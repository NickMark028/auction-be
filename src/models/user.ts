import db from '../utils/db';
import generate from '../models/generic.model';

let userModel = generate('user','id')

 async function findByUserName (username: string) {
  const rows = await db('user').where('username', username);
  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

async function isValidRefreshToken(userId: any, refreshToken: any) {
  const rows = await db('user')
  .where('id', userId)
  .andWhere('rfToken', refreshToken);

  return rows.length !== 0;
}

export default { userModel, findByUserName, isValidRefreshToken };
