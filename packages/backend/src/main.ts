import { CamelCasePlugin, PostgresDialect, Kysely } from "kysely";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";
import { Socket, createContextBuilder } from "./router2/context";

import pg from "pg";
import { loadConfig } from "./config/config";
import { DB } from "./core/schema";
import { initRouter } from "./router2/router";

const Pool = pg.Pool;

const config = loadConfig();
if (config.isErr()) {
  throw config.error;
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: config.value.DATABASE_URL,
  }),
});

const db = new Kysely<DB>({
  dialect,
  log(event) {
    if (event.level === "query") {
      console.log(event.query.sql);
      console.log(event.query.parameters);
    }
  },
  plugins: [new CamelCasePlugin()],
});

const onlineStudents = new Map<string, Socket>();
const onlineVolunteers = new Map<string, Socket>();

const wss = new WebSocketServer({
  port: 4001,
});
const handler = applyWSSHandler({
  wss,
  router: initRouter(db, onlineVolunteers, onlineStudents),
  createContext: createContextBuilder(),
});

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});
console.log("✅ WebSocket Server listening on ws://localhost:4001");

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
