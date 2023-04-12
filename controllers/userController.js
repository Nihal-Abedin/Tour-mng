const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factoryHandeler = require("./handelerFactory");
const filteredBody = (body, ...allowedFields) => {
  const filterResults = {};
  Object.keys(body).forEach((el) => {
    if (allowedFields.includes(el)) {
      filterResults[el] = body[el];
    }
  });

  return filterResults;
};
exports.getme = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getAllUsers = factoryHandeler.getAll(User);
exports.getUser = factoryHandeler.getOne(User);
exports.updateUser = factoryHandeler.updateOne(User);
exports.deleteUser = factoryHandeler.deleteOne(User);
exports.getUser = factoryHandeler.getOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    message: "Please use Signup!",
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirm_password) {
    return next(
      new AppError(
        "This route is not for Password update. Please use '/updatePassword'",
        400
      )
    );
  }
  const customBody = filteredBody(req.body, "name", "email");
  const updatedUser = await User.findByIdAndUpdate(req.user._id, customBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: "Success!",
    data: { user: updatedUser },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.status(204).json({
    message: "Deleted!",
  });
});
