const readline = require("readline");
const fs = require("fs");
const http = require("http");
const url = require("url");
const events = require("events");

//? User defined modules

const { replaceHtml } = require("./Modules/replace");
const user = require("./Modules/user");

/* //? 	Lecture 04
* Reading input & writing output

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Please, enter your name: ", (name) => {
  console.log(`You entered: ${name}`);
  rl.close();
});

rl.on("close", () => {
  console.log("Interface closed");
  process.exit(0);
});
*/

/* //? 	Lecture 05
* Reading & writing to a file

let textIn = fs.readFileSync("./files/input.txt", "utf-8");
console.log(textIn);

let content = `Data read from input.txt: ${textIn} \nDate created ${new Date()}`;

fs.writeFileSync("./files/output.txt", content);
*/

/* //? 	Lecture 07
* Reading & writing files asynchronously

fs.readFile("./files/start.txt", "utf-8", (error1, data1) => {
  console.log(data1);
  fs.readFile(`./files/${data1}.txt`, "utf-8", (error2, data2) => {
    console.log(data2);
    fs.readFile("./files/append.txt", "utf-8", (error3, data3) => {
      console.log(data3);
      fs.writeFile(
        "./files/output.txt",
        `${data2}\n\n${data3}\n\nDate created ${new Date()}`,
        () => {
          console.log("File written successfully.");
        },
      );
    });
  });
}); //! callback hell

console.log("Reading file...");
*/

//? Lectures 08...20
//* Creating a simple web server

// const html = fs.readFileSync("./template/index.html", "utf-8");

// let products = JSON.parse(fs.readFileSync("./Data/products.json", "utf-8"));
// let productListHtml = fs.readFileSync("./template/product-list.html", "utf-8");
// let productDetailsHtml = fs.readFileSync(
//   "./template/product-details.html",
//   "utf-8",
// );

// const server = http.createServer((req, res) => {
//   let { pathname: path, query } = url.parse(req.url, true);
//   //? let path = req.url

//   if (path === "/" || path.toLocaleLowerCase() === "/home") {
//     res.writeHead(200, {
//       "Content-Type": "text/html",
//       "my-header": "Hello world",
//     });
//     res.end(html.replace("{{%CONTENT%}}", "You are in Home page"));
//   } else if (path.toLocaleLowerCase() === "/about") {
//     res.writeHead(200, {
//       "Content-Type": "text/html",
//       "my-header": "Hello world",
//     });
//     res.end(html.replace("{{%CONTENT%}}", "You are in about page"));
//   } else if (path.toLocaleLowerCase() === "/contact") {
//     res.writeHead(200, {
//       "Content-Type": "text/html",
//     });
//     res.end(html.replace("{{%CONTENT%}}", "You are in contact page"));
//   } else if (path.toLocaleLowerCase() === "/products") {
//     if (!query.id) {
//       let productHtmlArray = products.map((prod) => {
//         return replaceHtml(productListHtml, prod);
//       });
//       let productResponseHtml = html.replace(
//         "{{%CONTENT%}}",
//         productHtmlArray.join(""),
//       );
//       res.writeHead(200, {
//         "Content-Type": "text/html",
//       });
//       res.end(productResponseHtml);
//     } else {
//       let prod = products[query.id];
//       let productDetailsResponseHtml = replaceHtml(productDetailsHtml, prod);
//       res.end(html.replace("{{%CONTENT%}}", productDetailsResponseHtml));
//     }
//   } else {
//     res.writeHead(404, {
//       "Content-Type": "text/html",
//     });
//     res.end(html.replace("{{%CONTENT%}}", "Error 404: Page not found!"));
//   }
// });

const server = http.createServer();

// server.on("request", (req, res) => {
//   let { pathname: path, query } = url.parse(req.url, true);
//   //? let path = req.url

//   if (path === "/" || path.toLocaleLowerCase() === "/home") {
//     res.writeHead(200, {
//       "Content-Type": "text/html",
//       "my-header": "Hello world",
//     });
//     res.end(html.replace("{{%CONTENT%}}", "You are in Home page"));
//   } else if (path.toLocaleLowerCase() === "/about") {
//     res.writeHead(200, {
//       "Content-Type": "text/html",
//       "my-header": "Hello world",
//     });
//     res.end(html.replace("{{%CONTENT%}}", "You are in about page"));
//   } else if (path.toLocaleLowerCase() === "/contact") {
//     res.writeHead(200, {
//       "Content-Type": "text/html",
//     });
//     res.end(html.replace("{{%CONTENT%}}", "You are in contact page"));
//   } else if (path.toLocaleLowerCase() === "/products") {
//     if (!query.id) {
//       let productHtmlArray = products.map((prod) => {
//         return replaceHtml(productListHtml, prod);
//       });
//       let productResponseHtml = html.replace(
//         "{{%CONTENT%}}",
//         productHtmlArray.join(""),
//       );
//       res.writeHead(200, {
//         "Content-Type": "text/html",
//       });
//       res.end(productResponseHtml);
//     } else {
//       let prod = products[query.id];
//       let productDetailsResponseHtml = replaceHtml(productDetailsHtml, prod);
//       res.end(html.replace("{{%CONTENT%}}", productDetailsResponseHtml));
//     }
//   } else {
//     res.writeHead(404, {
//       "Content-Type": "text/html",
//     });
//     res.end(html.replace("{{%CONTENT%}}", "Error 404: Page not found!"));
//   }
// });

server.listen(8000, "127.0.0.1", () => {
  // console.log("Server has started!");
});

/* //? Lecture 21
//* Emitting & handling custom events

let myEmitter = new user();

myEmitter.on("userCreate", (id, name) => {
  console.log(`New user ${name} with ID ${id} is created!`);
});
myEmitter.on("userCreate", (id, name) => {
  console.log(`New user ${name} with ID ${id} is added in database!`);
});

myEmitter.emit("userCreate", 101, "John");
*/

/* //? Lectures 23...24
//* Understanding streams in practice & pipe method

//? Without writable or readable stream
// server.on("request", (req, res) => {
//   fs.readFile("./files/large_file.txt", "utf-8", (err, data) => {
//     if (err) {
//       res.end("Something went wrong!!");
//       return;
//     }
//     res.end(data);
//   });
// });

//? With writable or readable stream
// server.on("request", (req, res) => {
//   let rs = fs.createReadStream("./files/large_file.txt");

//   rs.on("data", (chunk) => {
//     res.write(chunk);
//     // res.end(); //? close after first chunk
//   });

//   rs.on("end", () => {
//     res.end();
//   });

//   rs.on("error", (err) => {
//     res.end(err.message);
//   });

// });

//? Using pipe method
server.on("request", (req, res) => {
  let rs = fs.createReadStream("./files/large_file.txt");

  rs.pipe(res); //? readableSource.pipe(writableDestination)
});*/

/* //? Lecture 29
//* Event loop in practice

console.log("Prog has started.");

//? Stored in 2nd phase
fs.readFile("./files/input.txt", () => {
  console.log("File read complete!");

  //? Stored in 1st phase
  setTimeout(() => {
    console.log("Timer callback executed.");
  }, 0);

  //? Stored in 3rd phase
  setImmediate(() => {
    console.log("SetImmediate callback executed.");
  });

  process.nextTick(() => {
    console.log("Process.nextTick callback executed.");
  });
});

console.log("Prog has completed.");
*/
