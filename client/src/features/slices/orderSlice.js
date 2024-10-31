/** @format */

// imports
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { setHeaders, url } from "./api";

// initial state
const initialState = {
	list: [],
	status: null,
	ordersCount: 0,
};

// Thunks
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
	try {
		const response = await axios.get(`${url}/orders/get-orders`, setHeaders());
		return response.data;
	} catch (error) {
		console.error("Error fetching orders:", error.response?.message);
		toast.error(error.response?.data, {
			position: "bottom-left",
		});
	}
});

export const createOrder = createAsyncThunk(
	"orders/createOrder",
	async (formData, { rejectWithValue }) => {
		try {
			const response = await axios.post(
				`${url}/orders/create`,
				formData,
				setHeaders()
			);
			return response.data;
		} catch (error) {
			console.error("Error creating order:", error.response.message);
			toast.error(error.response?.data, {
				position: "bottom-left",
			});
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteOrder = createAsyncThunk(
	"orders/deleteOrder",
	async (orderId) => {
		try {
			await axios.delete(`${url}/orders/delete/${orderId}`, setHeaders());
			return orderId; // Return the deleted order's ID
		} catch (error) {
			console.error("Error deleting order:", error.response?.message);
			toast.error(error.response?.data, {
				position: "bottom-left",
			});
		}
	}
);

export const updateOrder = createAsyncThunk(
	"orders/updateOrder",
	async ({ id, values }) => {
		try {
			const response = await axios.put(
				`${url}/orders/update/${id}`,
				values,
				setHeaders()
			);
			return response.data; // Assuming the server returns the updated order
		} catch (error) {
			console.error("Error updating order:", error.response?.message);
			toast.error(error.response?.data, {
				position: "bottom-left",
			});
		}
	}
);

export const fetchOrdersCount = createAsyncThunk(
	"orders/fetchOrdersCount",
	async () => {
		try {
			const response = await axios.get(
				`${url}/orders/get-orderscount`,
				setHeaders()
			);
			return response.data.count;
		} catch (error) {
			console.error("Error fetching orders count:", error.response?.message);
			toast.error(error.response?.data, {
				position: "bottom-left",
			});
		}
	}
);

// Slice
const ordersSlice = createSlice({
	name: "orders",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchOrdersCount.fulfilled, (state, action) => {
				state.ordersCount = action.payload;
				state.status = "success";
			})
			.addCase(fetchOrdersCount.pending, (state) => {
				state.status = "pending";
			})
			.addCase(fetchOrdersCount.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(fetchOrders.fulfilled, (state, action) => {
				state.list = action.payload;
				state.status = "success";
			})
			.addCase(fetchOrders.pending, (state) => {
				state.status = "pending";
			})
			.addCase(fetchOrders.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.list.push(action.payload);
				state.status = "success";
				toast.success("Order created successfully", {
					position: "bottom-left",
				});
			})
			.addCase(createOrder.pending, (state) => {
				state.status = "pending";
			})
			.addCase(createOrder.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(deleteOrder.fulfilled, (state, action) => {
				state.list = state.list.filter((order) => order.id !== action.payload);
				state.status = "success";
			})
			.addCase(deleteOrder.pending, (state) => {
				state.status = "pending";
			})
			.addCase(deleteOrder.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(updateOrder.fulfilled, (state, action) => {
				const updatedOrder = action.payload;
				const index = state.list.findIndex(
					(order) => order.id === updatedOrder.id
				);
				if (index !== -1) {
					state.list[index] = updatedOrder;
				}
				state.status = "success";
			})
			.addCase(updateOrder.pending, (state) => {
				state.status = "pending";
			})
			.addCase(updateOrder.rejected, (state) => {
				state.status = "rejected";
			});
	},
});

export default ordersSlice.reducer;
