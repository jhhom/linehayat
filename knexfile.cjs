// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  test: {
    client: "postgresql",
    searchPath: "public", // 1. add this
    connection: {
      database: "linehayat_test",
      user: "postgres",
      password: "",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      schemaName: "public", // 2. add this
      tableName: "knex_migrations",
    },
  },
  development: {
    client: "postgresql",
    searchPath: "public", // 1. add this
    connection: {
      database: "linehayat",
      user: "postgres",
      password: "",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      schemaName: "public", // 2. add this
      tableName: "knex_migrations",
      loadExtensions: [".cjs"],
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
