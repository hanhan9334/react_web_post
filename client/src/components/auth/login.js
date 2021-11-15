import React, { Fragment, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { removeAlert, setAlert } from "../../features/alertSlice"
import PropTypes from "prop-types"
import { setRegisterFail, setRegisterSuccess } from "../../features/authSlice"
import axios from "axios"

const Login = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		password2: ""
	})

	const { email, password } = formData

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value })

	//Set dispatch for Redux
	const dispatch = useDispatch() 

	const handleLogin = async (e) => {
		e.preventDefault()

		const newUser = {
			email,
			password
		}
		try {
			//Set request header
			const config = {
				headers: {
					"Content-Type": "Application/json"
				}
			}
			//Set request body
			const body = JSON.stringify(newUser)
			//Make request
			const res = await axios.post("/api/users", body, config)
			dispatch(setRegisterSuccess({ token: res.data.token }))
		} catch (error) {
			const errors = error.response.data.errors
			if (errors) {
				errors.forEach((error) => {
					dispatch(setAlert({ msg: error.msg, type: "danger" }))
					//Remove the alert state after 2 seconds
					setTimeout(() => dispatch(removeAlert(0)), 2000)
				})
			}
			dispatch(setRegisterFail())
			console.error(error.response.data)
		}
	}

	return (
		<Fragment>
			<h1 className="large text-primary">Sign Up</h1>
			<p className="lead">
				<i className="fas fa-user"></i> Sign into Your Account
			</p>
			<form className="form" onSubmit={(e) => handleLogin(e)}>
				<div className="form-group">
					<input
						type="email"
						placeholder="Email Address"
						name="email"
						value={email}
						onChange={(e) => onChange(e)}
						required
					/>
					<small className="form-text">
						This site uses Gravatar so if you want a profile image, use a
						Gravatar email
					</small>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Password"
						name="password"
						value={password}
						onChange={(e) => onChange(e)}
						required
						minLength="6"
					/>
				</div>
				<input type="submit" className="btn btn-primary" value="Login" />
			</form>
			<p className="my-1">
				Don't have an account? <Link to="/register">Register</Link>
			</p>
		</Fragment>
	)
}

export default Login
