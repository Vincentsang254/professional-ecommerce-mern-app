/** @format */

const express = require("express");

const {
	deleteUser,
	getUsers,
	createUsers,
	updateUser,
	getUserById,
} = require("../controllers/userController");
const {
	verifyTokenAndAuthorization,
	verifyAdmin,
} = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.delete(
	"/delete/:userId",
	verifyTokenAndAuthorization,
	verifyAdmin,
	deleteUser
);
router.get("/get-users", verifyAdmin, getUsers);
router.post("/create", verifyAdmin, createUsers);
router.put("/update/:userId", verifyTokenAndAuthorization, updateUser);
router.get("/get-user/:userId", verifyTokenAndAuthorization, getUserById);

module.exports = router;
