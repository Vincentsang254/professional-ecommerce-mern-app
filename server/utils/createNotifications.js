/** @format */
const { Notifications } = require("../models");

const createNotification = async (userId, type, content) => {
	try {
		const notification = await Notifications.create({
			userId,
			type,
			content,
		});
		return notification;
	} catch (error) {
		console.error("Error creating notification:", error);
		throw error;
	}
};

module.exports = {
	createNotification,
};
