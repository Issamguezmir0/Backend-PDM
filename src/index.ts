import express, { Application } from "express";
import { Database } from "./database";
import authRouter from "./router/auth-router";

const app: Application = express();

app.use(express.json());

app.use("/auth", authRouter);
databaseInit();

async function databaseInit() {
  await Database.initilize();
  app.listen(3000);
}
