/** @format */
module.exports = (sequelize, DataTypes) => {
	const Orders = sequelize.define("Orders", {
		totalPrice: {
			type: DataTypes.FLOAT,
			allowNull: false,
		},
		orderItems: {
			type: DataTypes.TEXT, // Changed from JSON to TEXT
			allowNull: false,
			defaultValue: "[]", // Default value as a JSON string
		},
		paymentStatus: {
			type: DataTypes.ENUM("Paid", "Pending"),
			allowNull: true,
			defaultValue: "Pending",
		},
		orderStatus: {
			type: DataTypes.ENUM("Delivered", "Pending", "Cancelled"),
			allowNull: true,
			defaultValue: "Pending",
		},
		userAddressId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "UserAddresses",
				key: "id",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
	});

	Orders.associate = (models) => {
		Orders.belongsTo(models.UserAddress, {
			foreignKey: "userAddressId",
			as: "userAddress",
			onDelete: "CASCADE",
		});
		Orders.belongsTo(models.Users, {
			foreignKey: "userId",
			as: "user",
			onDelete: "CASCADE",
		});
	};

	return Orders;
};
