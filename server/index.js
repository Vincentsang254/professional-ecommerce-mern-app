/** @format */

const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

// const { otpGenerate} = require("../util")

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const imageRoutes = require("./routes/imageRoutes");
const orderRoutes = require("./routes/orderRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userAddressRoutes = require("./routes/userAddressRoutes");
const ratingRoutes = require("./routes/ratingRoutes");

const app = express();

const port = process.env.PORT || 3001;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const db = require("./models");

app.get("/api", (req, res) => {
	res.send(`Hello from port ${port}`);
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/address", userAddressRoutes);
app.use("/api/ratings", ratingRoutes);

db.sequelize.sync().then(() => {
	app.listen(port, "0.0.0.0", () => {
		console.log(`Server running on http://localhost:${port}`);
	});
});
