/** @format */

const express = require("express");
const {
	login,

	signup,
	verification,
	sendVerificationCode,
	forgotPassword,
	changePassword,
	authMiddleware
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify/:verificationCode", verification);
router.post("/send-code", sendVerificationCode);
router.post("/forgot-password", forgotPassword);
router.put("/change-password", changePassword);
// router.get("/check-auth", authMiddleware, (req, res) => {
// 	const user = req.user;
// 	res.status(200).json({
// 	  success: true,
// 	  message: "Authenticated user!",
// 	  user,
// 	});
// });
module.exports = router;
