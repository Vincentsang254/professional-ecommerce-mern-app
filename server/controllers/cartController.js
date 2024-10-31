/** @format */
const { Products, Carts } = require("../models");

const addProductToCart = async (req, res) => {
	const { productId } = req.body;
	const userId = req.user.id; // Assuming req.user.id is correctly set

	try {
		let cart = await Carts.findOne({
			where: { userId: userId, productId: productId },
		});

		const product = await Products.findByPk(productId);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		if (cart) {
			cart.quantity += 1;
			cart.totalPrice = cart.quantity * parseFloat(product.price);
			await cart.save();
		} else {
			const totalPrice = parseFloat(product.price);
			cart = await Carts.create({
				userId: userId,
				productId: productId,
				quantity: 1,
				totalPrice: totalPrice,
			});
		}

		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

const getCartCount = async (req, res) => {
	const userId = req.user.id;

	try {
		const count = await Carts.count({ where: { userId } });
		res.status(200).json({ status: true, count });
	} catch (error) {
		res.status(500).json({ status: false, error: error.message });
	}
};

const removeItemFromCart = async (req, res) => {
	try {
		const cartId = req.params.cartId; // Assuming cartId is passed as a route parameter

		const cart = await Carts.findByPk(cartId);

		if (!cart) {
			return res.status(404).json({ message: "Cart item not found" });
		}

		await cart.destroy();

		res.json({ message: `Cart id ${cartId} removed successfully` });
	} catch (error) {
		res.status(500).json({ status: 500, error: error.message });
	}
};

const decreaseProductQuantity = async (req, res) => {
	try {
		const cartId = req.params.cartId; // Assuming cartId is passed as a route parameter

		const cart = await Carts.findByPk(cartId);

		if (!cart) {
			return res.status(404).json({ message: "Cart item not found" });
		}

		if (cart.quantity > 1) {
			cart.quantity -= 1;
			const product = await Products.findByPk(cart.productId);
			cart.totalPrice = cart.quantity * parseFloat(product.price);
			await cart.save();
			res.json({ message: "Product quantity decreased in cart", cart });
		} else {
			await cart.destroy();
			res.json({ message: "Product removed from cart" });
		}
	} catch (error) {
		res.status(500).json({ status: 500, error: error.message });
	}
};

const increaseProductQuantity = async (req, res) => {
	try {
		const cartId = req.params.cartId; // Assuming cartId is passed as a route parameter

		const cart = await Carts.findByPk(cartId);

		if (!cart) {
			return res.status(404).json({ message: "Cart item not found" });
		}

		cart.quantity += 1;
		const product = await Products.findByPk(cart.productId);
		cart.totalPrice = cart.quantity * parseFloat(product.price);
		await cart.save();

		res.json({ message: "Product quantity increased in cart", cart });
	} catch (error) {
		res.status(500).json({ status: 500, error: error.message });
	}
};

const getCart = async (req, res) => {
	try {
		const cartItems = await Carts.findAll({
			where: { userId: req.user.id },
			include: [
				{
					model: Products,
					as: "product",
				},
			],
		});

		if (!cartItems.length) {
			return res.status(404).json({ message: "Cart not found" });
		}

		const totalPrice = cartItems.reduce((total, item) => {
			return total + item.quantity * parseFloat(item.product.price);
		}, 0);

		res.json({
			total: cartItems.length,
			totalPrice,
			cartItems: cartItems.map((item) => ({
				id: item.id,
				userId: item.userId,
				productId: item.productId,
				quantity: item.quantity,
				totalPrice: item.totalPrice,
				product: item.product,
			})),
		});
	} catch (error) {
		res.status(500).json({ status: 500, errors: error.message });
	}
};

module.exports = {
	getCartCount,
	addProductToCart,
	removeItemFromCart,
	getCart,
	decreaseProductQuantity,
	increaseProductQuantity,
};
