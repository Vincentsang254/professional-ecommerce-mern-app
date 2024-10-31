/** @format */

const jwt = require("jsonwebtoken");
const { Users } = require("../models");

const bcryptjs = require("bcryptjs");
// const generateAuthToken = require("../utils/generateAuthToken");
const generateOtp = require("../utils/otpGenerator");
const sendEmail = require("../utils/sendEmail");

const signup = async (req, res) => {
	try {
		let { email, name, password, phoneNumber } = req.body;

		email = email.toLowerCase();

		if (!email || email === "") {
			return res.status(400).json({
				status: 400,
				errors: ["please fill in email!"],
			});
		}
		if (!name || name === "") {
			return res.status(400).json({
				status: 400,
				errors: ["please fill in name!"],
			});
		}
		if (!phoneNumber || phoneNumber === "") {
			return res.status(400).json({
				status: 400,
				errors: ["please fill in phoneNumber!"],
			});
		}
		if (!password || password === "") {
			return res.status(400).json({
				status: 400,
				errors: ["please fill in password!"],
			});
		}

		const emailRegez = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegez.test(email)) {
			return res.status(400).json({
				status: 400,
				errors: ["please use a valid email!"],
			});
		}

		const passwordLength = 8;
		const uppercaseRegex = /[A-Z]/;
		const lowercaseRegex = /[a-z]/;
		const numberRegex = /[0-9]/;
		const specialCharacterRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

		if (password.length < passwordLength) {
			return res.status(400).json({
				status: 400,
				errors: [`Password should be at least ${passwordLength} characters`],
			});
		}

		if (!numberRegex.test(password)) {
			return res.status(400).json({
				status: 400,
				errors: ["Password should contain at least one digit"],
			});
		}
		if (!uppercaseRegex.test(password)) {
			return res.status(400).json({
				status: 400,
				errors: ["Password should contain at least one uppercase letter"],
			});
		}

		if (!lowercaseRegex.test(password)) {
			return res.status(400).json({
				status: 400,
				errors: ["Password should contain at least one lowercase letter"],
			});
		}

		if (!specialCharacterRegex.test(password)) {
			return res.status(400).json({
				status: 400,
				errors: ["Password should contain at least one special character"],
			});
		}

		const existingUser = await Users.findOne({ where: { email: email } });

		if (existingUser) {
			return res
				.status(400)
				.json({ status: 400, errors: ["User Already Registered"] });
		}

		const hashPassword = await bcryptjs.hash(password, 10);

		const verificationCode = generateOtp();

		const user = await Users.create({
			email: email,
			name: name,
			phoneNumber: phoneNumber,
			verificationCode: verificationCode,
			password: hashPassword,
		});
		const secretKey = process.env.SECRET_KEY;
		const userToken = jwt.sign(
			{
				id: user.id,
				userType: user.userType,
				email: user.email,
				name: user.name,
				phoneNumber: user.phoneNumber,
				verificationcCode: user.verificationCode,
				verified: user.verified,
			},
			secretKey,
			{ expiresIn: "60d" }
		);

		res.status(200).json({
			status: 200,
			message: "User registered successfully ",
			data: user,
			token: userToken,
		});
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || email === "") {
			return res.status(400).json({
				status: 400,
				errors: ["please fill in email!"],
			});
		}

		if (!password || password === "") {
			return res.status(400).json({
				status: 400,
				errors: ["please fill in password!"],
			});
		}

		const emailRegez = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegez.test(email)) {
			return res.status(400).json({
				status: 400,
				errors: ["please use a valid email!"],
			});
		}

		const user = await Users.findOne({ where: { email: email } });

		if (!user) {
			return res.json({ status: 400, errors: ["User Doesn't Exist"] });
		}

		const match = await bcryptjs.compare(password, user.password);

		if (!match) {
			return res.json({
				status: 400,
				errors: ["Wrong Username And Password Combination"],
			});
		}

		// if (!user.verified) {
		// 	return res.json({
		// 		error: "Account not verified. Please verify your email address.",
		// 	});
		// }

		const secretKey = process.env.SECRET_KEY;
		const userToken = jwt.sign(
			{
				id: user.id,
				userType: user.userType,
				email: user.email,
				name: user.name,
				phoneNumber: user.phoneNumber,
				verificationcCode: user.verificationCode,
				verified: user.verified,
			},
			secretKey,
			{ expiresIn: "60d" }
		);

		res.status(200).json({ message: "Login success", token: userToken });
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const sendVerificationCode = async (req, res) => {
	try {
		const { email } = req.body;

		const user = await Users.findOne({ where: { email: email } });

		if (!user) {
			return res.status(404).json({ status: 400, errors: ["User not found"] });
		}

		// Generate a verification code
		const verificationCode = generateOtp();

		// Save the verification code to the user record
		user.verificationCode = verificationCode;
		await user.save();

		// Send the verification code to the user's email
		await sendEmail(email, verificationCode);

		res
			.status(200)
			.json({ status: 200, message: "Verification code sent successfully" });
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const verification = async (req, res) => {
	try {
		const { email, verificationCode } = req.body;

		const user = await Users.findOne({ where: { email: email } });

		if (!user) {
			return res.status(404).json({ status: 400, errors: ["User not found"] });
		}
		if (user.verificationCode != verificationCode) {
			return res.status(400).json({ status: 400, errors: ["Invalid Code"] });
		}
		if (user.email != email) {
			return res.status(400).json({ status: 400, errors: ["Invalid Email"] });
		}

		user.verificationCode = "";
		user.verified = true;

		await user.save();
		res.status(200).json({ status: 200, message: "User is verified" });
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;

		// Find the user by email
		const user = await Users.findOne({ where: { email: email } });

		if (!user) {
			return res.status(404).json({ status: 400, errors: ["User not found"] });
		}

		// Generate a 6-digit verification code

		const verificationCode = generateOtp();

		// Save the verification code to the user's record in the database
		user.verificationCode = verificationCode;
		await user.save();

		// Send an email to the user with the verification code
		await sendEmail(email, verificationCode);

		res.status(200).json({ message: "Verification code sent successfully" });
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const changePassword = async (req, res) => {
	try {
		const { email, newPassword, verificationCode } = req.body;

		// Find the user by email
		const user = await Users.findOne({ where: { email: email } });

		if (!user) {
			return res.status(400).json({ status: 400, errors: ["User not found"] });
		}

		// Check if the provided verification code matches the one stored in the user's record
		if (user.verificationCode !== verificationCode) {
			return res
				.status(400)
				.json({ status: 400, errors: ["Invalid verification code"] });
		}

		// Hash the new password
		const hashedPassword = await bcryptjs.hash(newPassword, 10);
		const newVerificationcCode = (user.verificationCode = "");
		const newUser = await user.update({
			password: hashedPassword,
			verificationCode: newVerificationcCode,
		});

		res
			.status(200)
			.json({ status: 200, message: "Password changed successfully", newUser });
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const authMiddleware = async (req, res, next) => {
	const token = req.cookies.token;
	if (!token)
	  return res.status(401).json({
		success: false,
		message: "Unauthorised user!",
	  });
  
	try {
	  const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
	  req.user = decoded;
	  next();
	} catch (error) {
	  res.status(401).json({
		success: false,
		message: "Unauthorised user!",
	  });
	}
  };
module.exports = {
	login,
	signup,
	verification,
	sendVerificationCode,
	forgotPassword,
	changePassword,

};
