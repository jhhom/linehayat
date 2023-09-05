exports.up = async function (knex) {
  await knex.raw(/* sql */ `
    CREATE TABLE volunteers (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `);
};

exports.down = async function (knex) {
  await knex.raw(/* sql */ `
    DROP TABLE volunteers;
  `);
};
