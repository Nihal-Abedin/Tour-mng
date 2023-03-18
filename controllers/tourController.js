const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";

  next();
};

exports.getAllTour = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      message: "Success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err,
    });
  }
};
exports.getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);
    res.status(200).json({
      message: "Success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: `Invalid Id: ${id}!`,
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    newTour.save({ validateBeforeSave: true });
    res.status(201).json({
      message: "Succesfully Created!",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: "Invalid Data Sent!",
    });
  }
};
exports.updateTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      message: "Success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await Tour.findByIdAndDelete(id);
    res.status(204).json({
      message: "Success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err,
    });
  }
};

exports.getTourMonthly = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err,
    });
  }
};
