/** @format */

// routes/notificationRoutes.js
const express = require("express");
const {
	getNotifications,
	markAsRead,
	getNots,
} = require("../controllers/notificationController");

const { verifyToken, verifyTokenAndAuthorization } = require("../middlewares/AuthMiddleware");
const router = express.Router();

router.get("/get/:userId", verifyTokenAndAuthorization, getNotifications);
router.get("/get",verifyTokenAndAuthorization, getNots);
router.put("/marked/:notificationId", verifyTokenAndAuthorization, markAsRead);

module.exports = router;
