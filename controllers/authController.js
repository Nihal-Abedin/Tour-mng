const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const SendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");

const createToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_SIG, {
    expiresIn: process.env.JWT_EXPIRESIN,
  });
  return token;
};

const createSendToken = (user, statusCode, res) => {
  const token = createToken(user._id);
  res.status(statusCode).json({
    status: statusCode,
    message: "Success!",
    data: {
      user,
      token,
    },
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({ ...req.body, role: "user" });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please Provide Email and Password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Email or Password is Invalid!", 401));
  }
  createSendToken(user, 200, res);
});

exports.isAuthorized = catchAsync(async (req, res, next) => {
  let token = "";
  const { authorization } = req.headers;

  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("Please Login to get access!", 401));
  }
  //   const token = authorization.split(" ")[1];
  //   console.log(token);

  const decodedValue = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_SIG
  );

  const user = await User.findById(decodedValue.id);

  if (!user) {
    return next(new AppError("Invalid User! Please login!", 401));
  }
  console.log(user);
  console.log(user.isPasswordchangedAfterToken(decodedValue.iat), decodedValue);
  if (user.isPasswordchangedAfterToken(decodedValue.iat)) {
    return next(
      new AppError("User recently chnaged password! Please Login again!", 401)
    );
  }

  req.user = user;
  next();
});

exports.allowAccessRoles = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not permitted to use this resource!", 401)
      );
    }
    next();
  };
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("No user with this email!", 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forget your password? Submit a PATCH request with your new Password and Confirm PAssword to:${resetUrl}.\n If not please ignore this Email!`;

  try {
    await SendEmail({
      email: user.email,
      subject: "Your Password reset token(valid for only 10 mins)",
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There is an error send Reset Password Email! Please try again later.",
        500
      )
    );
  }

  res.status(200).json({
    status: 200,
    message: "Token sent to your email",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hasedToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hasedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or expired!", 400));
  }
  user.password = req.body.password;
  user.confirm_password = req.body.confirm_password;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePassword(req.body.current_password, user.password))) {
    return next(new AppError("Password is incorrect!", 400));
  }
  user.password = req.body.password;
  user.confirm_password = req.body.confirm_password;

  await user.save();

  createSendToken(user, 200, res);
});
