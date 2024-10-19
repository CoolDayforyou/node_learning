const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Movie = require("../models/movieModel");

dotenv.config({
  path: "./config.env",
});

//? Connect to MongoDB
mongoose
  .connect(process.env.CONN_STR)
  .then((conn) => {
    console.log("DB connection successful");
  })
  .catch((error) => {
    console.log("Some error has occured");
  });

//? Read movies.json file
const movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

//? Delete existing movie docs from collection
const deleteMovies = async () => {
  try {
    await Movie.deleteMany();
    console.log("Data successfully deleted!");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

//? Import movies data to MongoDB collection
const importMovies = async () => {
  try {
    await Movie.create(movies);
    console.log("Data successfully imported!");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importMovies();
}
if (process.argv[2] === "--delete") {
  deleteMovies();
}
