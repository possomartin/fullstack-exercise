import pg, { PoolConfig } from "pg";
import dotenv from "dotenv";

const { Pool } = pg;

dotenv.config();

const configPool: PoolConfig = {
  user: process.env.USER,
  host: process.env.HOSTNAME,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const dbConnection = new Pool(configPool);

export default dbConnection;
