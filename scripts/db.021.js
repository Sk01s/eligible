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

  // Step 1: Create the Continents table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS Continents (
      ContinentID INTEGER PRIMARY KEY AUTOINCREMENT,
      ContinentName TEXT NOT NULL
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating Continents table:", err);
      } else {
        console.log("Continents table created.");
      }
    }
  );

  // Step 2: Create the BannedContinents table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS BannedContinents (
      BannedContinentID INTEGER PRIMARY KEY AUTOINCREMENT,
      BannedContinentDate DATE NOT NULL,
      ContinentID INTEGER NOT NULL,
      AccountStationOptionID INTEGER NOT NULL,
      FOREIGN KEY (ContinentID) REFERENCES Continents(ContinentID),
      FOREIGN KEY (AccountStationOptionID) REFERENCES AccountStationOptions(AccountStationOptionID)
    )
  `,
    (err) => {
      if (err) {
        console.error("Error creating BannedContinents table:", err);
      } else {
        console.log("BannedContinents table created.");
      }
    }
  );

  // Step 3: Insert continents into the Continents table
  const continents = [
    "Africa",
    "Antarctica",
    "Asia",
    "Europe",
    "North America",
    "Australia",
    "South America",
  ];

  const insertStatement = db.prepare(
    "INSERT INTO Continents (ContinentName) VALUES (?)"
  );

  continents.forEach((continent) => {
    insertStatement.run(continent, (err) => {
      if (err) {
        console.error(`Error inserting continent "${continent}":`, err);
      } else {
        console.log(`Continent "${continent}" added successfully.`);
      }
    });
  });

  insertStatement.finalize((err) => {
    if (err) {
      console.error("Error finalizing statement for continents:", err);
    } else {
      console.log("All continents have been added.");
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
