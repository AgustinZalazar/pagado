// db/index.ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "@/db/schema";

// Crear pool global (una sola vez)
const poolConnection = mysql.createPool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 10, // opcional, pero recomendado
});

// Instancia única de drizzle con pool
export const db = drizzle(poolConnection);

export { users };