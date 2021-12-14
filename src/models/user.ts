
import db from '../utils/db';
import generate from '../models/generic.model';


let userModel = generate('User','id')

 async function findByUserName (username: string) {
  const rows = await db('users').where('username', username);
  if (rows.length === 0) {
    return rows.toString();
  }

  return rows[0];
}

async function isValidRefreshToken(userId: any, refreshToken: any) {
  const rows = await db('users')
  .where('id', userId)
  .andWhere('rfToken', refreshToken);

  return rows.length !== 0;
}

export default {userModel, findByUserName, isValidRefreshToken}
