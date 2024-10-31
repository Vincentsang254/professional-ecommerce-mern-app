/** @format */

const {
	initiateSTKPush,
	processCallback,
	generateDarajaToken,
} = require("../controllers/paymentController");

const {
	createCheckoutSession,
	webhook,
} = require("../controllers/stripeController");

const express = require("express");
const router = express.Router();

router.post("/initiate-stk-push", generateDarajaToken, initiateSTKPush);
router.post("/process-callback", processCallback);

router.post("/create-checkout-session", createCheckoutSession);
router.post("/webhook", express.json({ type: "application/json" }), webhook);

module.exports = router;
