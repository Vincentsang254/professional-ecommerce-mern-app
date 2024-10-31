/** @format */

const { Stripe } = require("../models");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const { Orders, Images } = require("../models");
const cloudinary = require("../utils/cloudinary");
require("dotenv").config();

const createCheckoutSession = async (req, res) => {
	try {
		const customer = await stripe.customers.create({
			metadata: {
				userId: req.body.userId,
			},
		});

		const line_items = await Promise.all(
			req.body.cartItems.map(async (item) => {
				const uploadedImage = await cloudinary.uploader.upload(item.image, {
					upload_preset: "online-shop",
				});
				return {
					price_data: {
						currency: "usd",
						product_data: {
							name: item.name,
							images: [uploadedImage.secure_url],
							description: item.desc,
							metadata: {
								id: item.id,
							},
						},
						unit_amount: item.price * 100,
					},
					quantity: item.cartQuantity,
				};
			})
		);

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			shipping_address_collection: {
				allowed_countries: ["US", "CA", "KE"],
			},
			shipping_options: [
				{
					shipping_rate_data: {
						type: "fixed_amount",
						fixed_amount: {
							amount: 0,
							currency: "usd",
						},
						display_name: "Free shipping",
						delivery_estimate: {
							minimum: {
								unit: "business_day",
								value: 5,
							},
							maximum: {
								unit: "business_day",
								value: 7,
							},
						},
					},
				},
				{
					shipping_rate_data: {
						type: "fixed_amount",
						fixed_amount: {
							amount: 1500,
							currency: "usd",
						},
						display_name: "Next day air",
						delivery_estimate: {
							minimum: {
								unit: "business_day",
								value: 1,
							},
							maximum: {
								unit: "business_day",
								value: 1,
							},
						},
					},
				},
			],
			phone_number_collection: {
				enabled: true,
			},
			line_items,
			mode: "payment",
			customer: customer.id,
			success_url: `${process.env.CLIENT_URL}/checkout-success`,
			cancel_url: `${process.env.CLIENT_URL}/cart`,
		});

		res.send({ url: session.url });
	} catch (error) {
		res.status(500).json({ status: false, error: error.message });
	}
};

const createOrder = async (customer, data, line_items) => {
	const newOrder = {
		userId: customer.metadata.userId,
		customerId: data.customer,
		paymentIntentId: data.payment_intent,
		products: line_items.data.map((item) => ({
			productId: item.price.product.metadata.id,
			quantity: item.quantity,
		})),
		subtotal: data.amount_subtotal,
		total: data.amount_total,
		shipping: data.customer_details,
		payment_status: data.payment_status,
	};

	try {
		const savedOrder = await Orders.create(newOrder);
		console.log("Processed Order:", savedOrder);
	} catch (err) {
		console.log(err);
	}
};

const webhook = async (req, res) => {
	let data;
	let eventType;

	let webhookSecret = process.env.STRIPE_WEB_HOOK;

	if (webhookSecret) {
		let event;
		let signature = req.headers["stripe-signature"];

		try {
			event = stripe.webhooks.constructEvent(
				req.body,
				signature,
				webhookSecret
			);
		} catch (err) {
			console.log(`⚠️  Webhook signature verification failed:  ${err}`);
			return res.sendStatus(400);
		}
		data = event.data.object;
		eventType = event.type;
	} else {
		data = req.body.data.object;
		eventType = req.body.type;
	}

	if (eventType === "checkout.session.completed") {
		stripe.customers
			.retrieve(data.customer)
			.then(async (customer) => {
				try {
					stripe.checkout.sessions.listLineItems(
						data.id,
						{},
						function (err, lineItems) {
							if (err) {
								console.log(err);
							} else {
								createOrder(customer, data, lineItems);
							}
						}
					);
				} catch (err) {
					console.log(err);
				}
			})
			.catch((err) => console.log(err.message));
	}

	res.status(200).end();
};

module.exports = {
	createCheckoutSession,
	createOrder,
	webhook,
};
