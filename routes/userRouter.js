const express = require("express");

const {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  updateMe,
  deleteMe,
} = require("../controllers/userController");
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  isAuthorized,
  updatePassword,
} = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:resetToken", resetPassword);
router.patch("/updatePassword", isAuthorized, updatePassword);
router.patch("/updateMe", isAuthorized, updateMe);
router.delete("/deleteMe", isAuthorized, deleteMe);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
