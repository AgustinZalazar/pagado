import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "@/db/schema";

const connection = await mysql.createConnection({
    // host: "localhost",
    // user: "root",
    // password: "admin",
    // database: "pagado",
    host: process.env.DATABASE_HOST,
    port: +!process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

export const db = drizzle(connection);
export { users };