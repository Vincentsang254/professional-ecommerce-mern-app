/** @format */

const express = require("express");
const {
	createOrders,
	deleteOrders,
	updateOrders,
	getOrders,
	getOrder,
} = require("../controllers/orderController");
const {
	verifyTokenAndAuthorization,
	verifyAdmin,
} = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.post("/create", verifyTokenAndAuthorization, createOrders);
router.delete("/delete/:orderId", verifyTokenAndAuthorization, deleteOrders);
router.put("/update/:orderId", verifyAdmin, updateOrders);
router.get("/get-orders", verifyTokenAndAuthorization, getOrders);
router.get("/get-order/:orderId", verifyTokenAndAuthorization, getOrder);

module.exports = router;
