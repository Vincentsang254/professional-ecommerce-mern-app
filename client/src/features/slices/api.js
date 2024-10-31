/** @format */

export const url = "http://localhost:3001/api";

export const setHeaders = () => {
	const token = localStorage.getItem("token");

	const headers = {
		// headers: {
		// 	"x-auth-token": token,
		// },
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	return headers;
};
