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

  // Step 1: Add the new nullable ContinentID column to the Countries table
  db.run(
    `
    ALTER TABLE Countries ADD COLUMN ContinentID INTEGER NULL
  `,
    (err) => {
      if (err) {
        console.error(
          "Error adding ContinentID column to Countries table:",
          err
        );
      } else {
        console.log("ContinentID column added to Countries table.");
      }
    }
  );

  // Step 2: Create a foreign key constraint for ContinentID
  db.run(
    `
    CREATE TABLE IF NOT EXISTS Countries_New (
      CountryID INTEGER PRIMARY KEY AUTOINCREMENT,
      CountryName TEXT NOT NULL,
      Code TEXT NOT NULL,
      ContinentID INTEGER NULL,
      FOREIGN KEY (ContinentID) REFERENCES Continents(ContinentID)
    )
  `,
    (err) => {
      if (err) {
        console.error(
          "Error creating Countries_New table with foreign key:",
          err
        );
      } else {
        console.log(
          "Countries_New table created with ContinentID as foreign key."
        );
      }
    }
  );

  // Step 3: Copy data from old Countries table to Countries_New
  db.run(
    `
    INSERT INTO Countries_New (CountryID, CountryName, Code)
    SELECT CountryID, CountryName, Code FROM Countries
  `,
    (err) => {
      if (err) {
        console.error("Error copying data to Countries_New table:", err);
      } else {
        console.log("Data copied to Countries_New table.");
      }
    }
  );

  // Step 4: Drop the old Countries table
  db.run("DROP TABLE Countries", (err) => {
    if (err) {
      console.error("Error dropping old Countries table:", err);
    } else {
      console.log("Old Countries table dropped.");
    }
  });

  // Step 5: Rename Countries_New to Countries
  db.run("ALTER TABLE Countries_New RENAME TO Countries", (err) => {
    if (err) {
      console.error("Error renaming Countries_New table:", err);
    } else {
      console.log("Countries_New table renamed to Countries.");
    }
  });
});

db.close((err) => {
  if (err) {
    console.error("Error closing the database:", err);
  } else {
    console.log("Database connection closed.");
  }
});
