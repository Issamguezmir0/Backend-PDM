import express, { Application } from "express";
import { Database } from "./database";
import authRouter from "./router/auth-router";
import cors from "cors";
import ForgotPasswordRoute from "./router/ForgotPasswordRoute";
import bodyParser from "body-parser";
import passport from 'passport';
import authGoogleRoute from "../src/router/auth-google-router"
import { authenticateProfile } from './controller/auth-controller';


const app: Application = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/auth", authRouter);
app.use("/password", ForgotPasswordRoute);
databaseInit();

async function databaseInit() {
  await Database.initilize();
  app.listen(3002);
}
