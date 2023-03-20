const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
// uncaught exception
process.on("uncaughtException", (err) => {
  console.error(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION");
  process.exit(1);
});
const app = require("./app");

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

// mongoose.connect

const server = app.listen(process.env.PORT, () => {
  console.log(`Listening on port:${process.env.PORT}`);
});

// unhandled rejection
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION");
  server.close(() => {
    process.exit(1);
  });
});
