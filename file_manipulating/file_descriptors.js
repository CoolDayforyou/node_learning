const fs = require("fs");
const fs_promises = require("fs/promises");

const fileOpen = () => {
  //? async method
  fs.open("./test.txt", "r", (err, fd) => {
    // fd - file descriptor
  });

  //? sync method
  // try {
  // 	const fd = fs.openSync("./test.txt", "r");
  // console.log(fd);

  // } catch (error) {
  // 	console.log(error);
  // }
};

// fileOpen()

//? promise-based
async function example() {
  let filehandle;
  try {
    filehandle = await fs_promises.open("./test.txt", "r");
    console.log(filehandle.fd);
    console.log(await filehandle.readFile({ encoding: "utf8" }));
  } finally {
    if (filehandle) await filehandle.close();
  }
}

example();
