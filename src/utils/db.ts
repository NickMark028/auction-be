import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DATABASE_HOST!,
    port: parseInt(process.env.DATABSE_PORT!),
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASS!,
    database: process.env.DATABASE_NAME!,
    ssl : {
      rejectUnauthorized: false
    }
  },
  pool: {
    min: 0,
    max: 10,
    afterCreate: (connection: any, callback: any) => {
      connection.query(`SET time_zone = '+7:00'`, (err: any) =>
        callback(err, connection)
      );
    },
  },
});

export default db;
