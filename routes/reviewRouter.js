const express = require("express");

const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourAndUserId,
  getReview,
} = require("../controllers/reviewController");

const {
  allowAccessRoles,
  isAuthorized,
} = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(isAuthorized);
router
  .route("/")
  .get(getAllReviews)
  .post(allowAccessRoles("user"), setTourAndUserId, createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(allowAccessRoles("user", "admin"), updateReview)
  .delete(allowAccessRoles("user", "admin"), deleteReview)
  .delete(deleteReview);
module.exports = router;
