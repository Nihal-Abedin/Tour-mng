const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 201,
    message: "Successfully created!",
    data: {
      user: newUser,
    },
  });
});
