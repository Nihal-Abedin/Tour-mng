const express = require("express");
const {
  createTour,
  deleteTour,
  getAllTour,
  getTour,
  updateTour,
} = require("../controllers/tourController");
const router = express.Router();

router.route("/").get(getAllTour).post(createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
