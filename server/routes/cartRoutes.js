/** @format */

const express = require("express");
const {
	getCartCount,
	addProductToCart,
	removeItemFromCart,
	getCart,
	decreaseProductQuantity,
	increaseProductQuantity,
} = require("../controllers/cartController");

const { verifyToken , verifyTokenAndAuthorization} = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.get("/get-cart-count/:userId", verifyTokenAndAuthorization, getCartCount);
router.get("/get", verifyTokenAndAuthorization, getCart);
router.post("/add-product-to-cart", verifyTokenAndAuthorization, addProductToCart);
router.delete("/delete/:cartId", verifyTokenAndAuthorization, removeItemFromCart);
router.put("/delete/:cartId/descrease", verifyTokenAndAuthorization, decreaseProductQuantity);
router.put("/delete/:cartId/increase", verifyTokenAndAuthorization, increaseProductQuantity);

module.exports = router;
