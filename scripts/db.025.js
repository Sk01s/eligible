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

  // Step 1: Create a new table with the desired column name
  db.run(
    `
    CREATE TABLE IF NOT EXISTS AccountStationOptions_New (
      AccountStationOptionID INTEGER PRIMARY KEY AUTOINCREMENT,
      AccountStationOptionName TEXT NOT NULL
    )
  `,
    (err) => {
      if (err) {
        console.error(
          "Error creating new AccountStationOptions_New table:",
          err
        );
      } else {
        console.log("New AccountStationOptions_New table created.");
      }
    }
  );

  // Step 2: Copy data from the old table to the new one
  db.run(
    `
    INSERT INTO AccountStationOptions_New (AccountStationOptionID, AccountStationOptionName)
    SELECT AccountStationOptionID, AccountStationName FROM AccountStationOptions
  `,
    (err) => {
      if (err) {
        console.error("Error copying data to AccountStationOptions_New:", err);
      } else {
        console.log("Data copied to AccountStationOptions_New.");
      }
    }
  );

  // Step 3: Drop the old table
  db.run("DROP TABLE IF EXISTS AccountStationOptions", (err) => {
    if (err) {
      console.error("Error dropping old AccountStationOptions table:", err);
    } else {
      console.log("Old AccountStationOptions table dropped.");
    }
  });

  // Step 4: Rename the new table to the old table's name
  db.run(
    "ALTER TABLE AccountStationOptions_New RENAME TO AccountStationOptions",
    (err) => {
      if (err) {
        console.error("Error renaming AccountStationOptions_New table:", err);
      } else {
        console.log(
          "AccountStationOptions_New table renamed to AccountStationOptions."
        );
      }
    }
  );
});

db.close((err) => {
  if (err) {
    console.error("Error closing the database:", err);
  } else {
    console.log("Database connection closed.");
  }
});
