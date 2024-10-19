const Movie = require("../models/movieModel");

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query; //Movie.find()
    this.queryStr = queryStr; //req.query
  }

  filter() {
    //! REMOVE pre-set fields from query for required response
    const excludeFields = ["sort", "fields", "limit", "page"];
    const queryFields = { ...this.queryStr };
    excludeFields.forEach((field) => delete queryFields[field]);

    const regex = /\b(gte|gt|lte|lt)\b/g;
    let queryString = JSON.stringify(queryFields);
    queryString = queryString.replace(regex, (match) => `$${match}`);
    const queryObj = JSON.parse(queryString);

    this.query = this.query.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("name");
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    }
    this.query = this.query.select("-__v");

    return this;
  }

  paginate() {
    const page = +this.queryStr.page || 1;
    const limit = +this.queryStr.limit || 10;
    const skip = limit * (page - 1);
    this.query = this.query.skip(skip).limit(limit);

    // if (this.queryStr.page) {
    //   const moviesCount = await Movie.countDocuments();
    //   if (skip >= moviesCount) {
    //     throw new Error("This page is not found!");
    //   }
    // }

    return this;
  }
}

module.exports = ApiFeatures;
