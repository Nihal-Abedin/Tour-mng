const mongoose = require("mongoose");
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factoryController = require("./handelerFactory");
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";

  next();
};

exports.getAllTour = factoryController.getAll(Tour);
exports.getTour = factoryController.getOne(Tour, { path: "reviews" });
exports.createTour = factoryController.createOne(Tour);
exports.updateTour = factoryController.updateOne(Tour);
exports.deleteTour = factoryController.deleteOne(Tour);

// /tours-within/:distance/center/:latlon/unit/:unit
// /tours-within/233/center/:-40,45/unit/:mi
exports.getToursWithIn = catchAsync(async (req, res, next) => {
  const { distance, latlon, unit } = req.params;
  const [lat, lon] = latlon.split(",");

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lon) {
    return next(
      new AppError(
        "Please provide latitude and longitude in format lat,lon",
        400
      )
    );
  }
  const tour = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lon, lat], radius] } },
  });
  console.log(distance, latlon, unit);
  res.status(200).json({
    message: "Success!",
    results: tour.length,
    data: {
      data: tour,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlon, unit } = req.params;
  const [lat, lon] = latlon.split(",");

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;
  if (!lat || !lon) {
    return next(
      new AppError(
        "Please provide latitude and longitude in format lat,lon",
        400
      )
    );
  }
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [+lon, +lat],
        },
        distanceField: "distance",
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    message: "Success!",
    data: {
      data: distances,
    },
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: "$difficulty",
        totalTours: { $sum: 1 },
        totalRatings: { $sum: "$ratingsQuantity" },
        avgRatings: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);
  res.status(200).json({
    message: "Success",
    data: stats,
  });
});

exports.getTourMonthly = catchAsync(async (req, res, next) => {
  const { year } = req.params;

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        name: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
  ]);

  res.status(200).json({
    message: "Success",
    data: plan,
  });
});
