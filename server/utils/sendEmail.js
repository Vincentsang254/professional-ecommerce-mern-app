/** @format */

const nodemailer = require("nodemailer");

const sendEmail = async (userEmail, message) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		host: "smtp.gmail.com",
		port: 465,
		secure: true, // or 'STARTTLS'
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD,
		},
	});

	const mailOptions = {
		from: {
			name: "Your Name",
			address: process.env.EMAIL,
		},
		to: userEmail,
		subject: "E-BEE verification code",
		html: `<h1>E-BEE Email verification code.</h1>
    <p>Your verification code is:</p>
    <h2 style="color: blue;">${message}</h2>
     <p>Please enter this code to verify registration process</p>
     <h1>If you didn't request this, please ignore this email.</h1>`,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log("Email sent");
	} catch (error) {
		console.log("Email sent failed with an error", error);
	}
};

module.exports = sendEmail;
