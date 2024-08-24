const fs = require("fs");
const fs_promises = require("fs/promises");

const content = "Some content...";

const fileWrite = () => {
  //? async method
  fs.writeFile("./test_writing_01.txt", content, (err) => {
    if (err) {
      console.log(err);
    }
  });

  //? sync method
  // try {
  //   fs.writeFileSync("./test_writing_02.txt", content);
  // } catch (error) {
  //   console.log(error);
  // }
};

// fileWrite()

//? promise-based
async function example() {
  try {
    await fs_promises.writeFile("./test_writing_03.txt", content);
  } catch (error) {
    console.log(error);
  }
}

example();
