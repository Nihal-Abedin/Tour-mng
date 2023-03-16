const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Tour Must Have A Name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A Tour Must Have A Price"],
  },
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
