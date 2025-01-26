import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "@/db/schema";

const connection = await mysql.createConnection({
    host: "*****",
    user: "****",
    password: "****",
    database: "****",
});

export const db = drizzle(connection);
export { users };