const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating-controller");

router.get("/user-ratings/:userId", ratingController.getUserRatings);

router.get("/spot-ratings/:spotId", ratingController.getSpotRatings);

router.post("/add-rating:id", ratingController.addSpotRating);

router.delete("/delete-rating/:id", ratingController.deleteSpotRating);

module.exports = router;