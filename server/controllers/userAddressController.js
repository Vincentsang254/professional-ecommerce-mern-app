/** @format */

const { UserAddress } = require("../models");

const createAddress = async (req, res) => {
	const { firstName, lastName, addressLine, country, city, phone, postalCode } =
		req.body;
	const userId = req.user.id;

	try {
		const existingAddress = await UserAddress.findOne({ where: { userId } });

		if (existingAddress) {
			return res
				.status(400)
				.json({ status: 400, errors: ["User already has an address"] });
		}
		const newUserAddress = await UserAddress.create({
			firstName,
			lastName,
			addressLine,
			country,
			city,
			phone,
			postalCode,
			userId,
		});

		res
			.status(200)
			.json({ status: 200, message: "Address Added successfully" });
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const updateUser = async (req, res) => {
	const addressId = req.params.id;
	const { addressLine, country, city, phone, postalCode, firstName, lastName } =
		req.body;

	try {
		const updatedUserAddress = await UserAddress.findByPk(addressId);

		if (!updatedUserAddress) {
			return res
				.status(404)
				.json({ status: false, message: "User address not found" });
		}

		updatedUserAddress.addressLine = addressLine;
		updatedUserAddress.country = country;
		updatedUserAddress.city = city;
		updatedUserAddress.phone = phone;
		updatedUserAddress.postalCode = postalCode;
		updatedUserAddress.firstName = firstName;
		updatedUserAddress.lastName = lastName;

		await updatedUserAddress.save();

		res
			.status(200)
			.json({ status: 200, message: "Address updated successfully" });
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const getUserAddress = async (req, res) => {
	const userId = req.user.id; // Assuming userId is obtained from authentication middleware

	try {
		const userAddresses = await UserAddress.findAll({
			where: { userId },
		});

		res.status(200).json(userAddresses);
	} catch (error) {
		res.status(500).json({ status: false, Error: error.message });
	}
};

module.exports = {
	createAddress,
	updateUser,

	getUserAddress,
};
