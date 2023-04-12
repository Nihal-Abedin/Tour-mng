const express = require("express");

const {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  updateMe,
  deleteMe,
  getme,
} = require("../controllers/userController");
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  isAuthorized,
  updatePassword,
  allowAccessRoles,
} = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword/:resetToken", resetPassword);

// after this middleware all of the routes are protected
router.use(isAuthorized);

router.patch("/updatePassword", updatePassword);

router.get("/me", getme, getUser);
router.patch("/updateMe", updateMe);
router.delete("/deleteMe", deleteMe);

router.use(allowAccessRoles("admin"));

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
