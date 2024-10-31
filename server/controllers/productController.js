/** @format */

const { Products, Images, Users, Ratings } = require("../models"); // Ensure Images model is imported
const Sequelize = require("sequelize");
const path = require("path");
const cloudinary = require("../utils/cloudinary");

const createProducts = async (req, res) => {
	try {
		const { name, desc, price, category, images } = req.body;
		const userId = req.user.id;

		if (!images || !Array.isArray(images)) {
			return res.status(400).json({
				status: 400,
				errors: ["Images field is required and must be an array"],
			});
		}

		// Upload images to Cloudinary and get URLs
		const imageUrls = await Promise.all(
			images.map(async (image) => {
				const uploadedResponse = await cloudinary.uploader.upload(image, {
					upload_preset: "ebee",
				});
				return uploadedResponse.secure_url;
			})
		);

		// Create a new product with the uploaded image URLs
		const product = await Products.create({
			name,
			price,
			desc,
			category,
			userId,
			imageUrl: imageUrls.length
				? imageUrls
				: [
						"https://www.pixelstalk.net/wp-content/uploads/2016/07/Free-Amazing-Background-Images-Nature.jpg",
				  ], // Default image URL if none provided
		});

		// Save each image URL in the Images model
		if (imageUrls.length) {
			await Promise.all(
				imageUrls.map(async (imageUrl) => {
					await Images.create({
						productId: product.id,
						imageUrl,
						imageName: path.basename(imageUrl),
					});
				})
			);
		}

		res.status(200).json({
			message: "Product created successfully",
			product,
		});
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const deleteProducts = async (req, res) => {
	const productId = req.params.productId;
	try {
		const product = await Products.findByPk(productId);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		const imageUrls = product.imageUrl;

		await Promise.all(
			imageUrls.map(async (imageUrl) => {
				const publicId = imageUrl.split("/").pop().split(".")[0];
				await cloudinary.uploader.destroy(publicId);
			})
		);

		await Products.destroy({ where: { id: productId } });

		res.status(201).json({ message: "Product deleted successfully" });
	} catch (error) {
		console.error("Error deleting product:", error.message);
		res.status(500).json({ status: false, error: error.message });
	}
};

const updateProducts = async (req, res) => {
	const productId = req.params.productId;
	const { name, price, desc, images } = req.body;
	try {
		const product = await Products.findByPk(productId);

		if (!product) {
			return res
				.status(400)
				.json({ status: 400, errors: ["Product not found"] });
		}

		let updatedImageUrls = product.imageUrl;
		if (images) {
			await Promise.all(
				product.imageUrl.map(async (imageUrl) => {
					const publicId = imageUrl.split("/").pop().split(".")[0];
					await cloudinary.uploader.destroy(publicId);
				})
			);

			updatedImageUrls = await Promise.all(
				images.map(async (image) => {
					const uploadedResponse = await cloudinary.uploader.upload(image, {
						upload_preset: "ebee",
					});
					return uploadedResponse.secure_url;
				})
			);
		}

		await Products.update(
			{ name, price, desc, imageUrl: updatedImageUrls },
			{ where: { id: productId } }
		);

		res.status(200).json({ status: 200, message: "Product updated" });
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const getProducts = async (req, res) => {
	try {
		const products = await Products.findAll({
			attributes: {
				exclude: ["userId"],
			},
			include: [
				{
					model: Ratings,
					as: "ratings",
					required: false, // Use required: false for left join
					include: {
						model: Users,
						as: "user",
						attributes: ["name"],
					},
				},
			],
		});

		const formattedResponse = {
			total: products.length,
			products: products.map((product) => ({
				id: product.id,
				imageUrl: product.imageUrl,
				name: product.name,
				desc: product.desc,
				category: product.category,
				price: product.price.toString(),
				ratings: product.ratings.map((rating) => ({
					id: rating.id,
					rating: rating.rating,
					ratingCount: rating.ratingCount,
					desc: rating.desc,
					user: {
						name: rating.user ? rating.user.name : null,
					},
				})),
			})),
		};

		res.status(200).json({ status: 200, data: formattedResponse });
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const getProductById = async (req, res) => {
	try {
		const productId = req.params.productId;

		const product = await Products.findOne({ where: { id: productId } });

		if (!product) {
			return res.status(200).json({ message: "No product found", product: [] });
		}

		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ status: false, errors: error.message });
	}
};

const searchProductsByName = async (req, res) => {
	try {
		const product = await Products.findAll({
			where: {
				name: {
					[Sequelize.prototype.like]: `%${product}%`,
				},
			},
		});
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ Error: error.message });
	}
};

module.exports = {
	searchProductsByName,
	createProducts,
	deleteProducts,
	updateProducts,
	getProductById,
	getProducts,
};
