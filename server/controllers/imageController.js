/** @format */

const { Images } = require("../models"); // Import the Images model
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the directory exists
const ensureDirExists = (dir) => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
};

const imageUpload = async (req, res) => {
	ensureDirExists("./Images"); // Ensure the directory exists before using it

	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			cb(null, "./Images");
		},
		filename: (req, file, cb) => {
			cb(null, Date.now() + path.extname(file.originalname));
		},
	});

	const upload = multer({
		storage: storage,
		limits: { fileSize: 1024 * 1024 * 10 },
		fileFilter: (req, file, cb) => {
			const fileTypes = /jpeg|jpg|png/;
			const mimeType = fileTypes.test(file.mimetype);
			const extname = fileTypes.test(
				path.extname(file.originalname).toLowerCase()
			);
			if (mimeType && extname) {
				return cb(null, true);
			}
			cb("Please provide a proper image format (JPEG, JPG, PNG)");
		},
	}).single("Image");

	upload(req, res, async (err) => {
		if (err instanceof multer.MulterError) {
			console.error("Multer Error:", err.message);
			return res
				.status(400)
				.json({ multerError: "Multer Error", error: err.message });
		} else if (err) {
			console.error("Error:", err);
			return res.status(400).json({ error: err });
		}

		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		const imageUrl = req.file.path;

		try {
			// Save the image path to the MySQL database
			await Images.create({ imageUrl });
			res
				.status(201)
				.json({ message: "Image uploaded and saved successfully" });
		} catch (error) {
			console.error("Database Error:", error.message);
			res.status(500).json({ status: false, ErrorMessage: error.message });
		}
	});
};

module.exports = { imageUpload };
