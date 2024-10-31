/** @format */
module.exports = (sequelize, DataTypes) => {
	const Products = sequelize.define("Products", {
		imageUrl: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		desc: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		category: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		price: {
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
		},
	});

	Products.associate = (models) => {
		Products.belongsTo(models.Users, {
			foreignKey: "userId",
			as: "user",
			onDelete: "cascade",
		});

		Products.hasMany(models.Ratings, {
			foreignKey: "productId",
			as: "ratings",
			onDelete: "cascade",
		});

		Products.hasMany(models.Carts, {
			foreignKey: "productId",
			as: "carts",
			onDelete: "cascade",
		});
	};

	return Products;
};
