import { createSlice } from "@reduxjs/toolkit"

export const alertSlice = createSlice({
	name: "authAlert",
	initialState: {
		value: []
	},
	reducers: {
		setAlert: (state, action) => {
			state.value.push(action.payload)
		},
		removeAlert: (state, action) => {
			state.value.splice(action.payload, 1)
		}
	}
})

// Action creators are generated for each case reducer function
export const { setAlert, removeAlert } = alertSlice.actions

export default alertSlice.reducer
