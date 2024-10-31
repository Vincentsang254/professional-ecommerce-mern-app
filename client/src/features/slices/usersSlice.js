/** @format */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";
import { toast } from "react-toastify";

const initialState = {
	list: [],
	status: null,
	previousUsers: [],
	userCount: 0,
	userCreatedToday: [],
};

export const fetchPreviousUsers = createAsyncThunk(
	"users/fetchPreviousUsers",
	async () => {
		try {
			const response = await axios.get(
				`${url}/users/get-previoususers`,
				setHeaders()
			);
			return response.data;
		} catch (error) {
			console.log("Error fetching previous users", error.response.data);
			toast.error(error.response?.data, {
				position: "bottom-left",
			});
		}
	}
);

export const fetchUserCount = createAsyncThunk(
	"users/fetchUserCount",
	async () => {
		try {
			const response = await axios.get(
				`${url}/users/get-usercount`,
				setHeaders()
			);
			return response.data;
		} catch (error) {
			console.log("Error fetching user count", error.response.data);
			toast.error(error.response?.data, {
				position: "bottom-left",
			});
		}
	}
);

export const fetchUserCreatedToday = createAsyncThunk(
	"users/fetchUserCreatedToday",
	async () => {
		try {
			const response = await axios.get(
				`${url}/users/get-todaysusers`,
				setHeaders()
			);
			return response.data;
		} catch (error) {
			console.log("Error fetching user created today", error.response.data);
			toast.error(error.response?.data, {
				position: "bottom-left",
			});
		}
	}
);

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
	try {
		const response = await axios.get(`${url}/users/get-users`, setHeaders());

		return response.data;
	} catch (error) {
		console.log(" Error fetching a user", error.response.data);
		toast.error(error.response?.data, {
			position: "bottom-left",
		});
	}
});

export const deleteUser = createAsyncThunk(
	"users/deleteUser",
	async (userId) => {
		try {
			const response = await axios.delete(
				`${url}/users/delete-user/${userId}`,
				setHeaders()
			);

			return response.data;
		} catch (error) {
			console.log("Error deleting a user", error.response.data);
			toast.error(error.response?.data, {
				position: "bottom-left",
			});
		}
	}
);

export const createUser = createAsyncThunk(
	"users/createUser",
	async (userData) => {
		try {
			const response = await axios.post(`${url}/users/create`, userData);
			return response.data;
		} catch (error) {
			console.log(error.response.data);
			toast.error(" Error creating a user", error.response?.data, {
				position: "bottom-left",
			});
		}
	}
);

export const updateUser = createAsyncThunk(
	"users/updateUser",
	async (userData) => {
		try {
			const response = await axios.post(
				`${url}/users/update/${userData.id}`,
				userData
			);
			return response.data;
		} catch (error) {
			console.log("Error updating user", error.response.data);
			toast.error(error.response?.data, {
				position: "bottom-left",
			});
		}
	}
);

const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUsers.pending, (state) => {
				state.status = "pending";
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.list = action.payload;
				state.status = "success";
			})
			.addCase(fetchUsers.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(createUser.pending, (state) => {
				state.status = "pending";
			})
			.addCase(createUser.fulfilled, (state, action) => {
				state.users = action.payload;
				state.status = "success";
			})
			.addCase(createUser.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(deleteUser.pending, (state) => {
				state.status = "pending";
			})
			.addCase(deleteUser.fulfilled, (state, action) => {
				// state.users = state.users.filter((user) => user.id !== action.payload);
				const newList = state.list.filter((user) => user.id !== action.payload);
				state.users = newList;
				state.status = "success";
			})
			.addCase(deleteUser.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(updateUser.pending, (state) => {
				state.status = "pending";
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				const updatedUser = action.payload;
				state.users = state.users.map((user) =>
					user.id === updatedUser.id ? updatedUser : user
				);
				state.status = "success";
			})
			.addCase(updateUser.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(fetchPreviousUsers.pending, (state) => {
				state.status = "pending";
			})
			.addCase(fetchPreviousUsers.fulfilled, (state, action) => {
				// Handle successful fetch of previous users
				state.previousUsers = action.payload;
				state.status = "success";
			})
			.addCase(fetchPreviousUsers.rejected, (state) => {
				// Handle rejected fetch of previous users
				state.status = "rejected";
			})
			.addCase(fetchUserCount.pending, (state) => {
				state.status = "pending";
			})
			.addCase(fetchUserCount.fulfilled, (state, action) => {
				// Handle successful fetch of user count
				state.userCount = action.payload;
				state.status = "success";
			})
			.addCase(fetchUserCount.rejected, (state) => {
				// Handle rejected fetch of user count
				state.status = "rejected";
			})
			.addCase(fetchUserCreatedToday.pending, (state) => {
				state.status = "pending";
			})
			.addCase(fetchUserCreatedToday.fulfilled, (state, action) => {
				state.userCreatedToday = action.payload;
				state.status = "success";
			})
			.addCase(fetchUserCreatedToday.rejected, (state) => {
				state.status = "rejected";
			});
	},
});

export default usersSlice.reducer;
