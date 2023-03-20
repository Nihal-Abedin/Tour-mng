const AppError = require("../utils/appError");

const sendErrForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
const sendErrForProd = (err, res) => {
  console.log(err.validationMsg.length);
  if (err.isOperational) {
    if (err.validationMsg.length > 0) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        validations: err.validationMsg,
      });
    }
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error(err);

    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value ${value}: , Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationDB = (err) => {
  const keys = Object.keys(err.errors);
  const errMessages = keys.map((k) => ({ [k]: err.errors[k].message }));
  const message = err._message;
  return new AppError(message, 400, errMessages);
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrForDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    // console.log(error.name, "Name");
    if (err.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (err.name === "ValidationError") {
      error = handleValidationDB(error);
    }
    sendErrForProd(error, res);
  }
};
