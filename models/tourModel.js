const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Tour Must Have A Name"],
    unique: true,
  },
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
    // enum:['easy','medium','hard ']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A Tour Must Have A Price"],
  },
  priceDiscount: Number,
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
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
