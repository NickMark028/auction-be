import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DATABASE_HOST!,
    port: parseInt(process.env.DATABSE_PORT!),
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASS!,
    database: process.env.DATABASE_NAME!,
  },
  pool: { min: 0, max: 10 },
});

export default db;
