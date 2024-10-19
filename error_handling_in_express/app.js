//? Import package
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const moviesRouter = require("./routes/moviesRoutes");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./controllers/errorController");

let app = express();

app.use(helmet());

let limiter = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message:
    "We have received too many requests from this IP address! Please try after one hour.",
});

app.use("/api", limiter);

app.use(
  express.json({
    limit: "10kb",
  }),
);

app.use(sanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratings",
      "releaseYear",
      "releaseDate",
      "genres",
      "directors",
      "actors",
      "price",
    ],
  }),
);

app.use(express.static("./public"));

app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

//Using routes
app.use("/api/v1/movies", moviesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on the server :(`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on the server :(`);
  // err.status = "fail";
  // err.statusCode = 404;

  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server :(`,
    404,
  );

  next(err);
});

app.use(globalErrorHandler);

module.exports = app;
