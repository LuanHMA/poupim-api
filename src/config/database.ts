import { createPool } from "mysql2/promise";
import { env } from "./env";

export const db = createPool({
    host: env.MYSQL_HOST,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE
})