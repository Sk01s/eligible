import mysql from "mysql2/promise";
import { handleDBError } from "@/lib/utils";

// Environment variables for database connection
const {
  MYSQLHOST = "localhost",
  MYSQLPORT = "3306",
  MYSQLUSER = "root",
  MYSQLPASSWORD = "",
  MYSQLDATABASE = "your_database_name",
} = process.env;

let pool: mysql.Pool | null = null;

// Function to get the MySQL database connection pool (Singleton)
export async function getDatabase() {
  if (pool === null) {
    try {
      // Create a connection pool for better scalability
      pool = mysql.createPool({
        host: MYSQLHOST,
        port: parseInt(MYSQLPORT, 10),
        user: MYSQLUSER,
        password: MYSQLPASSWORD,
        database: MYSQLDATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });

      console.log("Connected to MySQL database successfully.");
    } catch (error) {
      handleDBError(error);
    }
  }
  return pool;
}

// No need to call db.end() here because the pool will remain open as long as the application is running.
