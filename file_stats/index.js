const fs = require("fs");
const fsPromises = require("fs/promises");

//? async method
// fs.stat("./test.txt", (err, stats) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(stats.isDirectory()); // false
//   console.log(stats.isFile()); // true
//   console.log(stats.isSymbolicLink()); // false
//   console.log(stats.size); // 718
// });

//? sync method
// try {
//   const stats = fs.statSync("./test.txt");
// } catch (error) {
//   console.log(error);
// }

//? promise-based

async function example() {
  try {
    const stats = await fsPromises.stat("./test.txt");
    console.log(stats.isDirectory());
    console.log(stats.isFile());
    console.log(stats.isSymbolicLink());
    console.log(stats.size);
  } catch (error) {
    console.log(error);
  }
}

example();
