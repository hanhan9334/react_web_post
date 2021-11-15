import React, { Fragment, useEffect } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import Landing from "./components/layout/Landing"
import Register from "./components/auth/Register"
import Login from "./components/auth/Login"
import "./App.css"
//Redux
import { Provider, useDispatch } from "react-redux"
import store from "./store"
import Alert from "./components/layout/Alert"
import setAuthToken from "./utils/setAuthToken"
import axios from "axios"
import { setLoadUserSuccess, setAuthError } from "./features/authSlice"

//Set request header using token in local storage
if (localStorage.token) {
	setAuthToken(localStorage.getItem("token"))
}

const App = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		const loadUser = async () => {
			if (localStorage.token) {
				setAuthToken(localStorage.getItem("token"))
			}
			try {
				const res = await axios.get("/api/auth")
				dispatch(setLoadUserSuccess(res.data))
			} catch (error) {
				dispatch(setAuthError())
			}
		}

		loadUser()
	}, [])

	return (
		<Router>
			<Fragment>
				<Navbar />
				<Route exact path="/" component={Landing} />
				<section className="container">
					<Alert />
					<Switch>
						<Route exact path="/register" component={Register} />
						<Route exact path="/login" component={Login} />
					</Switch>
				</section>
			</Fragment>
		</Router>
	)
}

export default App
