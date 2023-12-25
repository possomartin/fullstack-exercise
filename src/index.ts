import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

import session from "express-session";
import pgSession from "connect-pg-simple";

import dbConnection from "./config/connection.js";
import userRouter from "./routes/users.js";
import applicantRouter from "./routes/applicants.js";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

const sessionStore = pgSession(session);

/* Middleware Parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SECRET || "KEYBOARD CAT",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    store: new sessionStore({
      pool: dbConnection,
      tableName: "user_sessions",
    }),
  })
);

app.use("/users", userRouter);
app.use("/awesome/applicant", applicantRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
