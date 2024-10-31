/** @format */

const express = require("express");
const {
	deleteRatings,
	updateRatings,
	getRatings,
	getRatingById,
	createRatings,
} = require("../controllers/ratingsController");
const { verifyToken, verifyTokenAndAuthorization } = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.post("/create", verifyTokenAndAuthorization, createRatings);
router.get("/get", verifyTokenAndAuthorization, getRatings);
router.delete("/delete/:ratingId", verifyTokenAndAuthorization, deleteRatings);
router.put("/update/:ratingId", verifyTokenAndAuthorization, updateRatings);
router.get("/get-rating/:ratingId", verifyTokenAndAuthorization, getRatingById);

module.exports = router;
