import sqlite3 from "sqlite3";
import path from "path";

const dbFilePath = path.join(process.cwd(), "db", "mydb.sqlite");

const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log(`Database file connected at: ${dbFilePath}`);
  }
});

db.serialize(() => {
  // Enable foreign key support
  db.run("PRAGMA foreign_keys = ON", (err) => {
    if (err) {
      console.error("Error enabling foreign keys:", err);
    } else {
      console.log("Foreign key enforcement enabled.");
    }
  });

  // Drop the incorrectly named Contents table
  db.run("DROP TABLE IF EXISTS Contents", (err) => {
    if (err) {
      console.error("Error dropping Contents table:", err);
    } else {
      console.log("Contents table dropped successfully.");
    }
  });

  // Drop the incorrectly named BannedContents table
  db.run("DROP TABLE IF EXISTS BannedContents", (err) => {
    if (err) {
      console.error("Error dropping BannedContents table:", err);
    } else {
      console.log("BannedContents table dropped successfully.");
    }
  });
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error("Error closing the database:", err);
  } else {
    console.log("Database connection closed.");
  }
});
