/** @format */

const express = require("express");
const { imageUpload } = require("../controllers/imageController");
const {
	verifyTokenAndAuthorization,
} = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.post("/image-upload", verifyTokenAndAuthorization, imageUpload);

module.exports = router;
