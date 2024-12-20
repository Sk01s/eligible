import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

// Define the type for the database instance
type SQLiteDB = Database<sqlite3.Database, sqlite3.Statement>;

const dbFilePath = process.env.VOLUME_PATH
  ? path.resolve(process.cwd(), "..", "db", "mydb.sqlite")
  : path.resolve(process.cwd(), "db", "mydb.sqlite");

// Function to get the database connection
export async function getDatabase(): Promise<SQLiteDB> {
  return open({
    filename: dbFilePath,
    driver: sqlite3.Database,
  });
}

// Helper function to identify SQLite errors
