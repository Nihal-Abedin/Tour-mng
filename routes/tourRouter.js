const express = require("express");
const {
  createTour,
  deleteTour,
  getAllTour,
  getTour,
  updateTour,
  aliasTopTours,
} = require("../controllers/tourController");
const router = express.Router();

// router.param("id", checkId);

router.route("/top-5-tours").get(aliasTopTours, getAllTour);

router.route("/").get(getAllTour).post(createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
