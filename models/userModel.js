const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
    select: false,
  },
  confirm_password: {
    type: String,
    required: [true, "Confirm Password is required for Authentication!"],
    validate: {
      // This only works on CREATE and SAVE
      validator: function (val) {
        return this.password === val;
      },
      message: "Passwords are not same!",
    },
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin", "guide", "lead-guide"],
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// pre save Document middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.confirm_password = undefined;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Query Middleware

userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

// methods

userSchema.methods.comparePassword = (password, hasedPassword) => {
  return bcrypt.compare(password, hasedPassword);
};

userSchema.methods.isPasswordchangedAfterToken = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    console.log(JWTTimestamp, changedTime);
    return JWTTimestamp < changedTime;
  }

  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  console.log({ token }, { resetToken: this.passwordResetToken });
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
