/** @format */
module.exports = (sequelize, DataTypes) => {
	const CartProducts = sequelize.define("CartProducts", {
		cartId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Carts",
				key: "id",
			},
		},
		productId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Products",
				key: "id",
			},
		},
	});

	return CartProducts;
};
