import express from "express";
import cors from "cors";
import pg from "pg";
import {
  CreateWSSContextFnOptions,
  applyWSSHandler,
} from "@trpc/server/adapters/ws";

import { WebSocketServer } from "ws";

import appRouter from "./router";

const Pool = pg.Pool;

const wss = new WebSocketServer({
  port: 5001,
});

const createContext = (opts: CreateWSSContextFnOptions) => {
  return {};
};

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext,
});

const startServer = () => {
  wss.on("connection", (ws) => {
    console.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once("close", () => {
      console.log(`➖➖ Connection (${wss.clients.size})`);
    });
  });

  console.log("✅ WebSocket Server listening on ws://localhost:5001");

  process.on("SIGTERM", () => {
    console.log("SIGTERM");
    handler.broadcastReconnectNotification();
    wss.close();
  });
};

export { createContext, startServer };
