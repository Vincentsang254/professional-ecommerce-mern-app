/** @format */

const express = require("express");

const {
	createAddress,
	updateUser,

	getUserAddress,
} = require("../controllers/userAddressController");
const { verifyDriver, verifyToken, verifyTokenAndAuthorization } = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.get("/get", verifyDriver, verifyTokenAndAuthorization,  getUserAddress);
router.post("/create", verifyTokenAndAuthorization, createAddress);
router.put("/update/:addressId", verifyTokenAndAuthorization, updateUser);

module.exports = router;
