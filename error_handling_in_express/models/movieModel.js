const mongoose = require("mongoose");
const fs = require("fs");
const validator = require("validator");

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required field!"],
      unique: true,
      maxlength: [100, "Movie name must not have more than 100 characters!"],
      minlength: [4, "Movie name must have at least 4 characters!"],
      trim: true,
      // validate: [validator.isAlpha, "Name should only contains alphabets!"],
    },
    description: {
      type: String,
      required: [true, "Name is required field!"],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required field!"],
    },
    ratings: {
      type: Number,
      validate: {
        validator: function (value) {
          return value >= 1 && value <= 10;
        },
        message: "Ratings {{VALUE}} should be above 1 and below 10!",
      },
    },
    totalRatings: {
      type: Number,
    },
    releaseYear: {
      type: Number,
      required: [true, "Release year is required field!"],
    },
    releaseDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    genres: {
      type: [String],
      require: [true, "Genres is required field!"],
      // enum: {
      //   values: [
      //     "Action",
      //     "Adventure",
      //     "Sci-Fi",
      //     "Thriller",
      //     "Crime",
      //     "Drama",
      //     "Comedy",
      //     "Romance",
      //     "Biography",
      //   ],
      //   message: "This genre does not exist!",
      // },
    },
    directors: {
      type: [String],
      require: [true, "Directors is required field!"],
    },
    coverImage: {
      type: String,
      require: [true, "Cover image is required field!"],
    },
    actors: {
      type: [String],
      require: [true, "Actors is required field!"],
    },
    price: {
      type: Number,
      require: [true, "Price is required field!"],
    },
    createdBy: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

movieSchema.virtual("durationInHours").get(function () {
  return this.duration / 60;
});

//? Executed before doc saved in db
//* .save or .create
//! insertMany or findByIdAndUpdate will not work
movieSchema.pre("save", function (next) {
  this.createdBy = "COOLDAY";

  next();
});

movieSchema.post("save", function (doc, next) {
  const content = `A new movie doc with name ${doc.name} has been created by ${doc.createdBy}. \n`;
  fs.writeFileSync("./log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });

  next();
});

movieSchema.pre(/^find/, function (next) {
  this.find({ releaseDate: { $lte: Date.now() } });
  this.startTime = Date.now();

  next();
});

movieSchema.post(/^find/, function (docs, next) {
  this.endTime = Date.now();

  const content = `Query took ${this.endTime - this.startTime}ms. \n`;
  fs.writeFileSync("./log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });

  next();
});

movieSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } });

  next();
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
