/** @format */

const jwt = require("jsonwebtoken");
const { Users } = require("../models");

const verifyToken = async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];
			// console.log("Token received:", token);
			const decoded = jwt.verify(token, process.env.SECRET_KEY);
			// console.log("Token decoded:", decoded);
			req.user = await Users.findByPk(decoded.id);
			if (!req.user) {
				// console.log("User not found for decoded ID:", decoded.id);
				return res.status(401).json({ message: "User not found" });
			}
			next();
		} catch (error) {
			// console.error("Token verification error:", error);
			return res.status(401).json({ message: "Not authorized, please login" });
		}
	} else {
		return res.status(401).json({ message: "Not authorized, no token" });
	}
};
const verifyTokenAndAuthorization = (req, res, next) => {
	verifyToken(req, res, () => {
		if (
			req.user.userType === "Admin" ||
			req.user.userType === "Client" ||
			req.user.userType === "Driver" ||
			req.user.userType === "Finance_manager" ||
			req.user.userType === "Company_manager"
		) {
			next();
		} else {
			return res.status(403).json({
				status: false,
				message: "Not allowed, you don't need any specific user role ",
			});
		}
	});
};

const verifyAdmin = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.userType === "Admin") {
			next();
		} else {
			return res
				.status(403)
				.json({ status: false, message: "Not allowed, you not an Admin" });
		}
	});
};
const verifyDriver = (req, res, next) => {
	verifyToken(req, res, () => {
		if (req.user.userType === "Admin" || req.user.userType === "Driver") {
			next();
		} else {
			return res.status(403).json({ status: false, message: "Not allowed" });
		}
	});
};
const verifyFinanceManger = (req, res, next) => {
	verifyToken(req, res, () => {
		if (
			req.user.userType === "Admin" ||
			req.user.userType === "Finance_manager"
		) {
			next();
		} else {
			return res.status(403).json({ status: false, message: "Not allowed" });
		}
	});
};
const verifyCompanyManger = (req, res, next) => {
	verifyToken(req, res, () => {
		if (
			req.user.userType === "Admin" ||
			req.user.userType === "Company_manager"
		) {
			next();
		} else {
			return res.status(403).json({ status: false, message: "Not allowed" });
		}
	});
};

module.exports = {
	verifyToken,
	verifyFinanceManger,
	verifyCompanyManger,
	verifyDriver,
	verifyAdmin,
	verifyTokenAndAuthorization,
};
