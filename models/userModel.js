const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name!"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "A user must have an Email!"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email!"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Password is required for Authentication!"],
    minlength: 8,
  },
  confirm_password: {
    type: String,
    required: [true, "Confirm Password is required for Authentication!"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
