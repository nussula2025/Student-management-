// Usage: npm run init-db  -> creates StudentManagementDB and its two tables
import "dotenv/config";
import fs from "fs";
import mysql from "mysql2/promise";

const conn = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
});
await conn.query(fs.readFileSync(new URL("../database/schema.sql", import.meta.url), "utf8"));
console.log("Database and tables are ready.");
await conn.end();
