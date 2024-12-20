// import { existsSync, copyFileSync } from "fs";
// import { join } from "path";

// // Source and target paths
// const source = join("/app/db", "mydb.sqlite");
// const target = join("/db", "mydb.sqlite");

// // Check if source file exists
// if (existsSync(source)) {
//   try {
//     // Copy the file
//     copyFileSync(source, target);
//     console.log(`Successfully copied database to ${target}`);
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     console.error("Error copying file:", error?.message);
//   }
// } else {
//   console.error(`Source file not found at ${source}`);
// }
import { readdirSync } from "fs";
import { resolve } from "path";

function printDirectories(dirPath) {
  try {
    // Resolve the directory path
    const absolutePath = resolve(dirPath);

    // Read the contents of the directory
    const items = readdirSync(absolutePath, { withFileTypes: true });

    // Filter directories and print their names
    console.log(`Directories in: ${absolutePath}`);
    items.forEach((item) => {
      if (item.isDirectory()) {
        console.log(item.name);
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
  }
}

// Set the starting directory to `./..`
const targetPath = "./..";
printDirectories(targetPath);
