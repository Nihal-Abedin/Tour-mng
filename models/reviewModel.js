const mongoose = require("mongoose");
const Tour = require("./tourModel");
const AppError = require("../utils/appError");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Please give a review!"],
    },
    rating: {
      type: Number,
      min: [0, "Minimum is 0"],
      max: [5, "Maximum is 5"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "A review must belong to a Tour!"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A review must belong to a User!"],
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

//index

reviewSchema.index({ user: 1, tour: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  });
  next();
});

// static methods
reviewSchema.statics.calAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        noRatings: { $sum: 1 },
        avgRatings: { $avg: "$rating" },
      },
    },
  ]);
  console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].noRatings,
      ratingsAverage: stats[0].avgRatings,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// pre save middleeare
reviewSchema.post("save", function () {
  this.constructor.calAverageRatings(this.tour);
});

// query middleware

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.model.findOne(this.getQuery());
  // this.r = await this.model.findOne();
  if (!this.r) {
    return next(new AppError("No review with this id", 400));
  }
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
