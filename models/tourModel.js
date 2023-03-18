const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Tour Must Have A Name"],
      unique: true,
      minlength: [
        40,
        "A tour name have less then or equal than 40 characters!",
      ],
      maxlength: [
        10,
        "A tour name have more then or equal than 10 characters!",
      ],
      //   validate: [validator.isAlpha, "Tour name must only contain characters!"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A Tour Must Have A Duration!"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A Tour Must have A Max Group Size!"],
    },
    difficulty: {
      type: String,
      required: [true, "A Tour Must Have A Difficulty!"],
      // default:'easy',
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is eighter easy, medium or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      mqx: [5, "Rating must be velow 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A Tour Must Have A Price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: `Discount price ({VALUE}) should be less than regular price`,
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A Tour Must Have A Description!"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A TOur Must Have A Cover Image!"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Document middleware runs before save() and create()

// tourSchema.pre("save", function (next) {
//   this.slug = slugify(this.name, { lower: true });
// });

// tourSchema.post('save', function(doc, next){

// });

// Query middleware

tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  console.log(`Query took ${+(Date.now() - this.start)} ms`);
  next();
});

// Aggregation middleware

tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  //   console.log(this.pipeline());
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
