exports.up = async function (knex) {
  await knex.raw(/* sql */ `
    CREATE TABLE volunteers (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT FALSE NOT NULL,
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
