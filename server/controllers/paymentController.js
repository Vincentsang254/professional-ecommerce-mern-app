/** @format */

const axios = require("axios");

const { Payments } = require("../models");

// a middleware which is generated everything stk push is send
const generateDarajaToken = async (req, res, next) => {
	try {
		const consumer = process.env.MPESA_CONSUMER_KEY;
		const secret = process.env.MPESA_CONSUMER_SECRET;

		const auth = Buffer.from(`${consumer}:${secret}`).toString("base64");

		const response = await axios.get(
			"https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
			{
				headers: {
					Authorization: `Basic ${auth}`,
				},
			}
		);

		token = response.data.access_token;
		next();
	} catch (error) {
		console.error("Error generating Daraja token:", error.message);
		res.status(500).json({ message: error.message });
	}
};

const initiateSTKPush = async (req, res) => {
	try {
		const phone = req.body.phone.substring(1);
		const amount = req.body.amount;

		const date = new Date();
		const timestamps =
			date.getFullYear() +
			("0" + (date.getMonth() + 1)).slice(-2) +
			("0" + (date.getDate() + 1)).slice(-2) +
			("0" + (date.getHours() + 1)).slice(-2) +
			("0" + (date.getMinutes() + 1)).slice(-2) +
			("0" + (date.getSeconds() + 1)).slice(-2);

		const shortcode = process.env.MPESA_PAYBILL;
		const passkey = process.env.MPESA_PASSKEY;

		const password = Buffer.from(
			`${shortcode}${passkey}${timestamps}`
		).toString("base64");

		const response = await axios.post(
			"https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest", //if you are live use api otherwise use sandbox
			{
				BusinessShortCode: shortcode,
				Password: password,
				Timestamp: timestamps,
				TransactionType: "CustomerPayBillOnline",
				Amount: amount,
				PartyA: `254${phone}`,
				PartyB: shortcode,
				PhoneNumber: `254${phone}`,
				CallBackURL:
					"https://506d-102-217-157-202.ngrok-free.app/api/payment/process-callback",
				AccountReference: `254${phone}`,
				TransactionDesc: "Payment for goods/services",
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);

		// console.log(response.data);
		res.status(201).json(response.data);
	} catch (error) {
		console.error("Error initiating STK push:", error.message);
		res.status(500).json({ status: false, error: error.message });
	}
};

const processCallback = async (req, res) => {
	try {
		const callbackData = req.body;
		console.log(`Callback meta data: ${callbackData}`);
		console.log(callbackData);

		// Check if callback data is valid
		if (!callbackData.Body.stkCallback.callbackMetadata) {
			console.log(callbackData.Body);
			return res.json("ok"); // send response to avoid duplicate data
		}
		//you need know the array of each(phone,amount, transaction code coming from safaricom)
		const phone = callbackData.Body.stkCallback.callbackMetadata.Item[4].Value;
		const amount = callbackData.Body.stkCallback.callbackMetadata.Item[0].Value;
		const trnx_id =
			callbackData.Body.stkCallback.callbackMetadata.Item[1].Value;

		const payment = await Payments.create({
			phone,
			amount,
			trnx_id,
		});

		console.log({ message: "Data saved successfully", data: payment });
		res.status(201).json(payment);
	} catch (error) {
		console.error("Error processing callback:", error.message);
		res.status(500).json({ status: false, error: error.message });
	}
};

module.exports = { initiateSTKPush, processCallback, generateDarajaToken };
