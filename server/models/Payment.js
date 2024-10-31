/** @format */
module.exports = (sequelize, DataTypes) => {
	const Payments = sequelize.define("Payments", {
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		amount: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		trnx_id: {
			type: DataTypes.STRING,
			allowNull: false,
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
		orderId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Orders",
				key: "id",
			},
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
		},
	});

	Payments.associate = (models) => {
		Payments.belongsTo(models.Users, {
			foreignKey: "userId",
			as: "user",
			onDelete: "CASCADE",
		});

		Payments.belongsTo(models.Orders, {
			foreignKey: "orderId",
			as: "order",
			onDelete: "CASCADE",
		});
	};

	return Payments;
};
