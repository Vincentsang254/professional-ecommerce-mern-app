/** @format */

const {
	createProducts,
	deleteProducts,
	updateProducts,
	getProducts,
	getProductById,
} = require("../controllers/productController");

const express = require("express");
const {
	verifyAdmin,
	verifyTokenAndAuthorization,
} = require("../middlewares/AuthMiddleware");
const router = express.Router();

router.post("/create", verifyAdmin, createProducts);
router.delete("/delete/:productId", verifyAdmin, deleteProducts);
router.put("/update/:productId", verifyAdmin, updateProducts);
router.get("/get-products", verifyTokenAndAuthorization, getProducts);
router.get(
	"/get-product/:productId",
	verifyTokenAndAuthorization,
	getProductById
); //not working TODO

module.exports = router;
