const Tour = require("../models/tourModel");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";

  next();
};

exports.getAllTour = async (req, res) => {
  try {
    console.log(req.query);
    const queryObj = { ...req.query };
    const excludeFields = ["page", "limit", "sort", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    //  for query operators
    let queryString = JSON.stringify(queryObj);

    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    console.log(JSON.parse(queryString));

    let query = Tour.find(JSON.parse(queryString));

    // sorting
    if (req.query.sort) {
      // sort('price duration ratingsAverage')
      const sortFields = req.query.sort.split(",").join(" ");
      query = query.sort(sortFields);
    }

    // limiting fields or projecting
    if (req.query.fields) {
      // sort('price duration ratingsAverage')
      const limitFields = req.query.fields.split(",").join(" ");
      query = query.select(limitFields);
    } else {
      query = query.select("-__v");
    }

    // pagination & Limit resource
    const page = +req.query.page || 1;

    const limit = +req.query.limit || 100;

    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("This page doesn't exists!");
    }
    // execute query
    const tours = await query;
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
