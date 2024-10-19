const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({
  path: "./config.env",
});

process.on("uncaughtException", (error) => {
  console.log(error.name, error.message);
  console.log("Uncaught exception occured! Shutting down...");

  process.exit(1);
});

const app = require("./app");

mongoose.connect(process.env.CONN_STR).then((conn) => {
  // console.log(conn);
  console.log("DB connection successful");
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log("Server has started...");
});

process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  console.log("Unhandled rejection occured! Shutting down...");

  server.close(() => {
    process.exit(1);
  });
});

