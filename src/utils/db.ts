import knex from 'knex';

export default knex({
  client: 'mysql2',
  connection: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.PORT!),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
  },
  pool: { min: 0, max: 10 },
});
