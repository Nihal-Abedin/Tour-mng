const Tour = require("../models/tourModel");

exports.getAllTour = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      message: "Success",
      data: {
        tours,
      },
    });
  } catch (err) {}
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
exports.updateTour = (req, res) => {
  res.status(201).json({
    message: "Succesfully Created!",
    data: {
      tour: "<Updated Tour>",
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    message: "Succesfully Created!",
    data: null,
  });
};
