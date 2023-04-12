const express = require("express");
const {
  createTour,
  deleteTour,
  getAllTour,
  getTour,
  updateTour,
  aliasTopTours,
  getTourStats,
  getTourMonthly,
  getToursWithIn,
  getDistances,
} = require("../controllers/tourController");
const router = express.Router();
const {
  isAuthorized,
  allowAccessRoles,
} = require("../controllers/authController");

const reviewRoute = require("./reviewRouter");
// router.param("id", checkId);

//nested review route on tour
router.use("/:tourId/reviews", reviewRoute);

router.route("/top-5-tours").get(aliasTopTours, getAllTour);
router.route("/tour-stats").get(getTourStats);
router
  .route("/monthly-plan/:year")
  .get(isAuthorized, allowAccessRoles("admin", "lead-guide"), getTourMonthly);

router
  .route("/tours-within/:distance/center/:latlon/unit/:unit")
  .get(getToursWithIn);
// /tours-within?distance=233&center=-40,45&unit=mi
// or
// /tours-within/233/center/:-40,45/unit/:mi

router
  .route("/")
  .get(getAllTour)
  .post(isAuthorized, allowAccessRoles("admin", "lead-guide"), createTour);

router.route("/distances/:latlon/unit/:unit").get(getDistances);

router
  .route("/:id")
  .get(getTour)
  .patch(isAuthorized, allowAccessRoles("admin"), updateTour)
  .delete(deleteTour);

// POST /tour/234/reviews
// Get /tour/234/reviews
// GET /tour/234/reviews/567

module.exports = router;
