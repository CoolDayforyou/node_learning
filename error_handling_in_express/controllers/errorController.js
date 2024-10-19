const CustomError = require("../utils/CustomError");
const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: "fail",
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const castErrorHandler = (error) => {
  const message = `Invalid value for ${error.path}: ${error.value} !`;
  return new CustomError(message, 400);
};

const duplicateKeyErrorHandler = (error) => {
  const name = error.keyValue.name;
  const message = `There is already a movie with name ${name}. Please use another name!`;
  return new CustomError(message, 400);
};

const validationErrorHandler = (error) => {
  const errors = Object.values(error.errors).map((value) => value.message);
  const errorMessages = errors.join(" ");
  const message = `Invalid input data: ${errorMessages}`;

  return new CustomError(message, 400);
};

const handleExpiredJWT = () => {
  return new CustomError("Your login has expired, please login again.", 401);
};

const handleJWTError = () => {
  return new CustomError("Invalid token, please login again.", 401);
};

const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: "fail",
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Try again later :(",
    });
  }
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    let err = JSON.parse(JSON.stringify(error));

    if (err.name === "CastError") err = castErrorHandler(err);
    if (err.code === 11000) err = duplicateKeyErrorHandler(err);
    if (err.name === "ValidationError") err = validationErrorHandler(err);
    if (err.name === "TokenExpiredError") err = handleExpiredJWT();
    if (err.name === "JsonWebTokenError") err = handleJWTError();

    prodErrors(res, err);
  }
};
