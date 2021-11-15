import { createSlice } from "@reduxjs/toolkit"

export const authSlice = createSlice({
	name: "auth",
	initialState: {
		value: {
			token: localStorage.getItem("token"),
			isAuthenticated: null,
			loading: true,
			user: null
		}
	},
	reducers: {
		setRegisterSuccess: (state, action) => {
			localStorage.setItem("token", action.payload.token)
			state.value = {
				token: action.payload.token,
				isAuthenticated: true,
				loading: false
			}
		},
		setRegisterFail: (state) => {
			localStorage.setItem("token", null)
			state.value = {
				token: null,
				isAuthenticated: false,
				loading: false
			}
		},
		setLoginSuccess: (state, action) => {
			localStorage.setItem("token", action.payload.token)
			state.value = {
				token: action.payload.token,
				isAuthenticated: true,
				loading: false
			}
		},
		setLoginFail: (state) => {
			localStorage.setItem("token", null)
			state.value = {
				token: null,
				isAuthenticated: false,
				loading: false
			}
		},
		setLoadUserSuccess: (state, action) => {
			state.value = {
				...state.value,
				isAuthenticated: true,
				loading: false,
				user: action.payload
			}
		},
		setAuthError: (state) => {
			localStorage.setItem("token", null)
			state.value = {
				token: null,
				isAuthenticated: false,
				loading: false
			}
		},
		setLogout: (state) => {
			localStorage.setItem("token", null)
			state.value = {
				token: null,
				isAuthenticated: false,
				loading: false
			}
		}
	}
})

// Action creators are generated for each case reducer function
export const {
	setRegisterSuccess,
	setRegisterFail,
	setAuthError,
	setLoadUserSuccess,
	setLogout,
	setLoginSuccess,
	setLoginFail
} = authSlice.actions

export default authSlice.reducer
