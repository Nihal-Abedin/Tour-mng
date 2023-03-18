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
} = require("../controllers/tourController");
const router = express.Router();

// router.param("id", checkId);

router.route("/top-5-tours").get(aliasTopTours, getAllTour);
router.route("/tour-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getTourMonthly);

router.route("/").get(getAllTour).post(createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
