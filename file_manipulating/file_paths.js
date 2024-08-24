const path = require("path");

const notes = "/users/joe/notes.txt";
const name = "joe";

function example() {
  console.log(path.dirname(notes)); // /users/joe
  console.log(path.basename(notes)); // notes.txt
  console.log(path.extname(notes)); // .txt
  console.log(path.basename(notes, path.extname(notes))); // notes

  const path_join = path.join("/", "users", name, "notes.txt");
  console.log(path_join); // \users\joe\notes.txt
}

example();
