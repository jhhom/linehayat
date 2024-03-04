# LineHayat

An anonymous chat peer support platform for students by students.

## Development commands

### To run migration

`knex migrate:make create_volunteers_table --knexfile knexfile.cjs`

`knex migrate:latest --knexfile knexfile.cjs`

`knex migrate:latest --knexfile knexfile.cjs --env=test`

`knex migrate:up --knexfile knexfile.cjs`

`knex migrate:down --knexfile knexfile.cjs`

### Introspecting the database

`pnpm run db:introspect`

### Requirements

- NVM or node v18.12.1
- pnpm v7.15.0

### Install & start entire application:

```bash
pnpm install;
pnpm run dev;
```
