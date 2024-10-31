/** @format */

const bcryptjs = require("bcryptjs");
const { Users } = require("../models");
const generateOtp = require("../utils/otpGenerator");

// TODO revisit createUsers
const createUsers = async (req, res) => {
	const { email, name, password } = req.body;

	try {
		const user = await Users.findOne({ where: { email: email } });

		if (user) {
			res.status(400).json("User Already registered");
		}

		const hashpass = await bcryptjs.hash(password, 10);
		const verificationCode = generateOtp();
		await Users.create({ email, name, verificationCode, password: hashpass });

		res.status(201).json("User created");
	} catch (error) {
		res.status(500).json({ status: false, Error: error.message });
	}
};

const deleteUser = async (req, res) => {
	const userId = req.params.userId;
	try {
		await Users.destroy({
			where: {
				id: userId,
			},
		});

		// if (!deletedUser) {
		// 	res.status(404).json({
		// 		status: false,
		// 		error: `No such user with ID ${deletedUser}`,
		// 	});
		// }
		res.status(201).json("User deleted succcessfully");
	} catch (error) {
		res.status(500).json({ status: false, Error: error.message });
	}
};
const updateUser = async (req, res) => {
	const userId = req.params.userId;
	const { email, name, password } = req.body;
	try {
		const user = await Users.findByPk(userId);

		if (!user) {
			return res.status(400).json({ error: "No user" });
		}

		await Users.update(
			{ email, name, password },
			{
				where: { id: userId },
			}
		);

		res.status(201).json("User Updated");
	} catch (error) {
		res.status(500).json({ status: false, Error: error.message });
	}
};
const getUsers = async (req, res) => {
	try {
		const users = await Users.findAll({
			attributes: {
				exclude: [
					"password",
					"verificationCode",
					"verified",
					"createdAt",
					"updatedAt",
				],
			},
		});
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ status: false, Error: error.message });
	}
};

const getUserById = async (req, res) => {
	const userId = req.params.userId;
	try {
		const user = await Users.findOne(
			{ where: { id: userId } },
			{
				attributes: { exclude: ["password"] },
			}
		);

		if (!user) {
			return res.status(404).json({ error: "No such user" });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ status: false, Error: error.message });
	}
};

module.exports = {
	createUsers,
	deleteUser,
	updateUser,
	getUsers,
	getUserById,
};
