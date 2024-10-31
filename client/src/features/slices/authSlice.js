/** @format */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import jwtDecode from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { setHeaders, url } from "./api";

const initialState = {
	token: localStorage.getItem("token") || null,
	phoneNumber: "",
	email: "",
	name: "",
	id: "",
	userType: null,
	registerStatus: "",
	registerError: "",
	loginStatus: "",
	loginError: "",
	userLoaded: false,
};

export const registerUser = createAsyncThunk(
	"auth/registerUser",
	async (values, { rejectWithValue }) => {
		try {
			const response = await axios.post(`${url}/auth/signup`, {
				email: values.email,
				phoneNumber: values.phoneNumber,
				name: values.name,
				password: values.password,
			});

			const token = response.data.token;

			localStorage.setItem("token", JSON.stringify(token));

			return token;
		} catch (error) {
			console.log(error.response.data);
			return rejectWithValue(error.response.data);
		}
	}
);

export const loginUser = createAsyncThunk(
	"auth/loginUser",
	async (values, { rejectWithValue }) => {
		try {
			const response = await axios.post(`${url}/auth/login`, {
				email: values.email,
				password: values.password,
			});

			const token = response.data.token;

			localStorage.setItem("token", JSON.stringify(token));
			return token;
		} catch (error) {
			console.log(error.response);
			return rejectWithValue(error.response.data);
		}
	}
);

export const getUser = createAsyncThunk(
	"auth/getUser",
	async (id, { rejectWithValue }) => {
		try {
			const token = await axios.get(
				`${url}/users/get-user/${id}`,
				setHeaders()
			);

			localStorage.setItem("token", JSON.stringify(token.data));

			return token.data;
		} catch (error) {
			console.log(error.response);
			return rejectWithValue(error.response.data);
		}
	}
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		loadUser(state, action) {
			const token = state.token;
			if (token) {
				const user = jwtDecode(token);

				return {
					...state,
					phoneNumber: user.phoneNumber,
					email: user.email,
					name: user.name,
					id: user.id,
					userType: user.userType,
					userLoaded: true,
				};
			} else {
				return { ...state, userLoaded: false };
			}
		},
		logoutUser(state, action) {
			localStorage.removeItem("token");

			return {
				...state,
				token: "",
				phoneNumber: "",
				email: "",
				name: "",
				id: "",
				userType: null,
				registerStatus: "",
				registerError: "",
				loginStatus: "",
				loginError: "",
			};
		},
	},
	extraReducers: (builder) => {
		builder.addCase(registerUser.pending, (state, action) => {
			return { ...state, registerStatus: "pending" };
		});
		builder.addCase(registerUser.fulfilled, (state, action) => {
			if (action.payload) {
				const user = jwtDecode(action.payload);

				return {
					...state,
					token: action.payload,
					phoneNumber: user.phoneNumber,
					email: user.email,
					name: user.name,
					id: user.id,
					userType: user.userType,
					registerStatus: "success",
				};
			} else return state;
		});
		builder.addCase(registerUser.rejected, (state, action) => {
			return {
				...state,
				registerStatus: "rejected",
				registerError: action.payload,
			};
		});
		builder.addCase(loginUser.pending, (state, action) => {
			return { ...state, loginStatus: "pending" };
		});
		builder.addCase(loginUser.fulfilled, (state, action) => {
			if (action.payload) {
				const user = jwtDecode(action.payload);

				return {
					...state,
					token: action.payload,
					phoneNumber: user.phoneNumber,
					name: user.name,
					email: user.email,
					id: user.id,
					userType: user.userType,
					loginStatus: "success",
				};
			} else return state;
		});
		builder.addCase(loginUser.rejected, (state, action) => {
			return {
				...state,
				loginStatus: "rejected",
				loginError: action.payload,
			};
		});
		builder.addCase(getUser.pending, (state, action) => {
			return {
				...state,
				getUserStatus: "pending",
			};
		});
		builder.addCase(getUser.fulfilled, (state, action) => {
			if (action.payload) {
				const user = jwtDecode(action.payload);

				return {
					...state,
					token: action.payload,
					phoneNumber: user.phoneNumber,
					email: user.email,
					name: user.name,
					id: user.id,
					userType: user.userType,
					getUserStatus: "success",
				};
			} else return state;
		});
		builder.addCase(getUser.rejected, (state, action) => {
			return {
				...state,
				getUserStatus: "rejected",
				getUserError: action.payload,
			};
		});
	},
});

export const { loadUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
