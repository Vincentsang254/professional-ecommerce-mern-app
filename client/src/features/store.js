/** @format */

import { configureStore } from "@reduxjs/toolkit";

import usersReducer from "./slices/usersSlice";
import productReducer from "./slices/productSlice";
import notificationReducer from "./slices/notificationSlice";
import orderReducer from "./slices/orderSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
	reducer: {
		users: usersReducer,
		products: productReducer,
		orders: orderReducer,
		auth: authReducer,
		notifications: notificationReducer,
	},
});
