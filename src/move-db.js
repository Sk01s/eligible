import fs from "fs";
import path from "path";

export function findAndPrintDbFiles(startPath) {
  try {
    // Resolve the starting path
    var absolutePath = path.resolve(startPath);
    var dbPath = path.join(absolutePath, "db");

    // Check if the 'db' directory exists
    if (fs.existsSync(dbPath) && fs.statSync(dbPath).isDirectory()) {
      console.log("Found 'db' directory at: " + dbPath);

      // Define source and target file paths
      const source = path.join(absolutePath, "/app/db", "mydb.sqlite");
      const target = path.join(absolutePath, "/db", "mydb.sqlite");

      // Check if the target file already exists
      if (fs.existsSync(target)) {
        console.log(`Target file already exists at ${target}. Skipping copy.`);
      } else {
        // Check if source file exists and copy if necessary
        if (fs.existsSync(source)) {
          fs.copyFileSync(source, target);
          console.log(`Successfully copied database to ${target}`);
        } else {
          console.error(`Source file not found at ${source}`);
        }
      }

      // Read and print all files in the 'db' directory
      var dbFiles = fs.readdirSync(dbPath);
      for (var i = 0; i < dbFiles.length; i++) {
        console.log("File in 'db': " + dbFiles[i]);
      }
    } else {
      console.log("No 'db' directory found in: " + absolutePath);
    }
  } catch (error) {
    console.error("Error: " + error.message);
  }
}

// Set the starting directory to `./..`
var targetPath = "./..";
findAndPrintDbFiles(targetPath);
