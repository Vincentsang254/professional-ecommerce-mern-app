/** @format */
module.exports = (sequelize, DataTypes) => {
	const Users = sequelize.define("Users", {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phoneNumber: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		profilePic: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue:
				"https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg",
		},
		verified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
		verificationCode: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		userType: {
			type: DataTypes.ENUM(
				"Admin",
				"Client",
				"Driver",
				"Finance_manager",
				"Company_manager"
			),
			allowNull: false,
			defaultValue: "Client",
		},
	});

	Users.associate = (models) => {
		Users.hasMany(models.Products, {
			foreignKey: "userId",
			as: "products",
			onDelete: "cascade",
		});
		Users.hasMany(models.Ratings, {
			foreignKey: "userId",
			as: "ratings",
			onDelete: "cascade",
		});
		Users.hasMany(models.Orders, {
			foreignKey: "userId",
			as: "orders",
			onDelete: "cascade",
		});
		Users.hasMany(models.UserAddress, {
			foreignKey: "userId",
			as: "addresses",
			onDelete: "cascade",
		});
	};

	return Users;
};
