# viteRPC: Vite + tRPC + TailwindCSS template

## To run migration

`knex migrate:make create_volunteers_table --knexfile knexfile.cjs`

`knex migrate:latest --knexfile knexfile.cjs`

`knex migrate:latest --knexfile knexfile.cjs --env=test`

`knex migrate:up --knexfile knexfile.cjs`

`knex migrate:down --knexfile knexfile.cjs`

## Introspecting the database

`pnpm run db:introspect`

## Requirements

- NVM or node v18.12.1
- pnpm v7.15.0

## Setup

Environment variables need to be setup.

```bash
# From ./ (root directory)

# React Frontend
cp ./packages/react/.env.local.example ./packages/react/.env.local;

# tRPC Backend
cp ./packages/trpc/.env.example ./packages/trpc/.env;
```

Install & start entire application:

```bash
pnpm install;
pnpm run dev;
```
