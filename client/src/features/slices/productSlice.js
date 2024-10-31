/** @format */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { setHeaders, url } from "./api";

const initialState = {
	list: [],

	status: null,
	productsCount: 0,
};

// Thunks
export const fetchProducts = createAsyncThunk(
	"products/fetchProducts",
	async () => {
		try {
			const response = await axios.get(
				`${url}/products/get-products`,
				setHeaders()
			);
			return response.data;
		} catch (error) {
			console.error("Error fetching products:", error.response?.message);
			toast.error(error.response?.data, {
				position: "bottom-left",
			});
		}
	}
);

export const createProduct = createAsyncThunk(
	"products/createProduct",
	async (formData, { rejectWithValue }) => {
		try {
			const response = await axios.post(
				`${url}/products/create`,
				formData,
				setHeaders()
			);
			return response.data;
		} catch (error) {
			console.error("Error creating product:", error.response.message);
			toast.error(error.response?.data, {
				position: "bottom-left",
			});
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteProduct = createAsyncThunk(
	"products/deleteProduct",
	async (productId) => {
		try {
			await axios.delete(`${url}/products/delete/${productId}`, setHeaders());
			return productId; // Return the deleted product's ID
		} catch (error) {
			console.error("Error deleting product:", error.response?.message);
			toast.error(error.response?.data, {
				position: "bottom-left",
			});
		}
	}
);

export const updateProduct = createAsyncThunk(
	"products/updateProduct",
	async ({ id, values }) => {
		try {
			const response = await axios.put(
				`${url}/products/update/${id}`,
				values,
				setHeaders()
			);
			return response.data; // Assuming the server returns the updated product
		} catch (error) {
			console.error("Error updating product:", error.response?.message);
			toast.error(error.response?.data, {
				position: "bottom-left",
			});
		}
	}
);

export const fetchProductsCount = createAsyncThunk(
	"products/fetchProductsCount",
	async () => {
		try {
			const response = await axios.get(
				`${url}/products/get-productscount`,
				setHeaders()
			);
			return response.data.count;
		} catch (error) {
			console.error("Error fetching products count:", error.response?.message);
			toast.error(error.response?.data, {
				position: "bottom-left",
			});
		}
	}
);

// Slice
const productsSlice = createSlice({
	name: "products",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProductsCount.fulfilled, (state, action) => {
				state.productsCount = action.payload;
				state.status = "success";
			})
			.addCase(fetchProductsCount.pending, (state) => {
				state.status = "pending";
			})
			.addCase(fetchProductsCount.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.list = action.payload;
				state.status = "success";
			})
			.addCase(fetchProducts.pending, (state) => {
				state.status = "pending";
			})
			.addCase(fetchProducts.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(createProduct.fulfilled, (state, action) => {
				state.list.push(action.payload);
				state.status = "success";
				toast.success("Product created successfully", {
					position: "bottom-left",
				});
			})
			.addCase(createProduct.pending, (state) => {
				state.status = "pending";
			})
			.addCase(createProduct.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(deleteProduct.fulfilled, (state, action) => {
				state.list = state.list.filter(
					(product) => product.id !== action.payload
				);
				state.status = "success";
			})
			.addCase(deleteProduct.pending, (state) => {
				state.status = "pending";
			})
			.addCase(deleteProduct.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(updateProduct.fulfilled, (state, action) => {
				const updatedProduct = action.payload;
				const index = state.list.findIndex(
					(product) => product.id === updatedProduct.id
				);
				if (index !== -1) {
					state.list[index] = updatedProduct;
				}
				state.status = "success";
			})
			.addCase(updateProduct.pending, (state) => {
				state.status = "pending";
			})
			.addCase(updateProduct.rejected, (state) => {
				state.status = "rejected";
			});
	},
});

export default productsSlice.reducer;
