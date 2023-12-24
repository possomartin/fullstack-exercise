import { Pool, PoolConfig } from "pg";
import dotenv from "dotenv";

dotenv.config();

const configPool: PoolConfig = {
  user: process.env.USER,
  host: process.env.HOSTNAME,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
};

const dbConnection = new Pool(configPool);

export default dbConnection;
