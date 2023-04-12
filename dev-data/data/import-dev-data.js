const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel");

// console.log(process.env);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully Connected to the Database!"));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("Data Successfully Loaded!");
    process.exit(1);
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data Successfully Deleted!");
    process.exit(1);
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
  //   process.exit(1);
}
if (process.argv[2] === "--delete") {
  deleteData();
  //   process.exit(1);
}
console.log(process.argv);
