import React from "react"
import App from "./App"
import { Provider, useDispatch } from "react-redux"
import store from "./store"

function AppWrapper() {
	return (
		<Provider store={store}>
			<App />
		</Provider>
	)
}

export default AppWrapper
