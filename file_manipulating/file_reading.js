const fs = require("fs");
const fs_promises = require("fs/promises");

const fileRead = () => {
  //? async method
  fs.readFile("./test.txt", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(data);
  });

  //? sync method
  // try {
  // 	const data = fs.readFileSync("./test.txt", "utf8");
  // 	console.log(data);
  // } catch (error) {
  // 	console.log(error);
  // }
};

// fileRead()

//? promise-based
async function example() {
  try {
    const data = await fs_promises.readFile("./test.txt", { encoding: "utf8" });
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
example();
