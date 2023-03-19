const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const TourRouter = require("./routes/tourRouter");
const UserRouter = require("./routes/userRouter");
const AppError = require("./utils/appError");
const GlobalErrorHandeler = require("./controllers/errorController");
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());

// custom middleware

app.use((req, res, next) => {
  console.log("Hello from 1st Middleware");
  next();
});

// app.get("/api/v1/tours", getAllTour);

// app.get("/api/v1/tours/:id", getTour);

// app.post("/api/v1/tours", createTour);

// app.patch("/api/v1/tours/:id", updateTour);

// app.delete("/api/v1/tours/:id", deleteTour);

app.use("/api/v1/tours", TourRouter);
app.use("/api/v1/users", UserRouter);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: 404,
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = "fail";
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(GlobalErrorHandeler);

module.exports = app;
