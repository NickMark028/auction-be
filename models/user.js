const db = require("../utils/db")




const TABLE_NAME = 'users';
const TABLE_ID = 'id';


function findAll() {
  return db(TABLE_NAME);
}
async function findById(id) {
  const list = await db(TABLE_NAME).where(TABLE_ID, id);
  if (list.length === 0)
    return null;

  return list[0];
}

function add(film) {
  return db(TABLE_NAME).insert(film);
}

function del(id) {
  return db(TABLE_NAME)
    .where(TABLE_ID, id)
    .del();
}

function patch(id, film) {
  return db(TABLE_NAME)
    .where(TABLE_ID, id)
    .update(film);
}
async function findByUserName  (username) {
  const rows = await db(TABLE_NAME).where('username', username);
  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

async function isValidRefreshToken(userId, refreshToken) {
  const rows = await db(TABLE_NAME)
    .where(TABLE_ID, userId)
    .andWhere('rfToken', refreshToken);

  if (rows.length === 0) {
    return false;
  }

  return true;
}


module.exports={findAll,findById,add,del,patch,findByUserName,isValidRefreshToken }
 