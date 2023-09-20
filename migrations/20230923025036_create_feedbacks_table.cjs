exports.up = async function (knex) {
  await knex.raw(/* sql */ `
      CREATE TABLE feedbacks (
          id SERIAL PRIMARY KEY,
          volunteer_id INT REFERENCES volunteers(id) NOT NULL,
          comment TEXT DEFAULT '' NOT NULL,
          session_start TIMESTAMP NOT NULL,
          session_end TIMESTAMP NOT NULL,
          rating NUMERIC(2, 1),
          updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
};

exports.down = async function (knex) {
  await knex.raw(/* sql */ `
      DROP TABLE feedbacks;
    `);
};
