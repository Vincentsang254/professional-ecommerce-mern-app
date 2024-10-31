/** @format */

const { Ratings } = require("../models");

const createRatings = async (req, res) => {
	try {
		// const productId = req.params.id;
		const userId = req.user.id;

		const newRating = {
			productId: req.body.productId,
			rating: req.body.rating,
			ratingCount: req.body.ratingCount,
			desc: req.body.desc,
			userId: userId,
		};

		const ratings = await Ratings.create(newRating);
		res.status(200).json({ status: 200, data: ratings });
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const deleteRatings = async (req, res) => {
	try {
		const ratingId = req.params.ratingId;
		await Ratings.destroy({ where: { ratingId } });
		res
			.status(200)
			.json({ status: 200, message: "Rating deleted successfully" });
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const updateRatings = async (req, res) => {
	const ratingId = req.params.ratingId;
	const { rating, ratingCount, desc, userId, productId } = req.body;

	try {
		const ratingRecord = await Ratings.findByPk(ratingId);

		if (!ratingRecord) {
			return res
				.status(400)
				.json({ status: 400, errors: ["Rating not found"] });
		}

		await Ratings.update(
			{ rating, ratingCount, desc, userId, productId },
			{ where: { id: ratingId } }
		);

		res.status(200).json({ status: 200, message: "Rating Updated" });
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const getRatings = async (req, res) => {
	try {
		const ratings = await Ratings.findAll({});
		res.status(200).json(ratings);
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};
const getRatingById = async (req, res) => {
	const ratingId = req.params.ratingId;
	try {
		const ratings = await Ratings.findOne({ where: { id: ratingId } });
		res.status(200).json({ status: 200, data: ratings });
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

module.exports = {
	deleteRatings,
	updateRatings,
	getRatings,
	getRatingById,
	createRatings,
};
