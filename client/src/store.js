import { configureStore } from "@reduxjs/toolkit"
import alertReducer from "./features/alertSlice"
import authSlice from "./features/authSlice"

export default configureStore({
	reducer: {
		alert: alertReducer,
		auth:authSlice
	}
})
