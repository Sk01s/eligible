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

  // Step 1: Create Contents table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS Contents (
      ContentID INTEGER PRIMARY KEY AUTOINCREMENT,
      ContentName TEXT NOT NULL
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating Contents table:", err);
      } else {
        console.log("Contents table created.");
      }
    }
  );

  // Step 2: Create BannedContents table with foreign key constraints
  db.run(
    `
    CREATE TABLE IF NOT EXISTS BannedContents_New (
      BannedContentID INTEGER PRIMARY KEY AUTOINCREMENT,
      BannedContentDate DATE NOT NULL,
      ContentID INTEGER NOT NULL,
      AccountStationOptionID INTEGER NOT NULL,
      FOREIGN KEY (ContentID) REFERENCES Contents(ContentID) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (AccountStationOptionID) REFERENCES AccountStationOptions(AccountStationOptionID) ON DELETE CASCADE ON UPDATE CASCADE
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating BannedContents_New table:", err);
      } else {
        console.log("BannedContents_New table created.");
      }
    }
  );

  // Step 3: Copy data from the old BannedContents table to the new table
  db.run(
    `
    INSERT INTO BannedContents_New (BannedContentID, BannedContentDate, ContentID, AccountStationOptionID)
    SELECT BannedContentID, BannedContentDate, ContentID, AccountStationOptionID
    FROM BannedContents
  `,
    (err) => {
      if (err) {
        console.error("Error copying data to BannedContents_New:", err);
      } else {
        console.log("Data copied to BannedContents_New.");
      }
    }
  );

  // Step 4: Drop the old BannedContents table
  db.run(`DROP TABLE BannedContents`, (err) => {
    if (err) {
      console.error("Error dropping old BannedContents table:", err);
    } else {
      console.log("Old BannedContents table dropped.");
    }
  });

  // Step 5: Rename the new BannedContents table to the original name
  db.run(`ALTER TABLE BannedContents_New RENAME TO BannedContents`, (err) => {
    if (err) {
      console.error("Error renaming BannedContents_New table:", err);
    } else {
      console.log("BannedContents_New table renamed to BannedContents.");
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
