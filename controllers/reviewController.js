const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const factoryHandeler = require("./handelerFactory");

exports.setTourAndUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factoryHandeler.getAll(Review);

exports.createReview = factoryHandeler.createOne(Review);

exports.updateReview = factoryHandeler.updateOne(Review);
exports.deleteReview = factoryHandeler.deleteOne(Review);
exports.getReview = factoryHandeler.getOne(Review);
