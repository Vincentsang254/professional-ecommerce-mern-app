// https://ebee-backend-code-main.onrender.com

/** @format */

export const url = "https://ebee-backend-code-main.onrender.com/api";

export const setHeaders = () => {
	const token = localStorage.getItem("token");

	const headers = {
		headers: {
			"x-auth-token": token,
		},
	};

	return headers;
};