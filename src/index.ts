import express, { Express, Request, Response } from "express";
import dbConnection from "./config/connection.js";

import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use("/awesome/applicant");

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
