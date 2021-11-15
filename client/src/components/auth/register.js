import React, { Fragment, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { removeAlert, setAlert } from "../../features/alertSlice"
import PropTypes from "prop-types"
import { setRegisterFail, setRegisterSuccess } from "../../features/authSlice"
import axios from "axios"

const Register = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		password2: ""
	})
	const { name, email, password, password2 } = formData

	//Get alerts from Redux
	const alerts = useSelector((state) => state.alert)

	//Set dispatch for Redux
	const dispatch = useDispatch()

	const onInputChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value })

	const handleRegister = async (e) => {
		e.preventDefault()
		if (password !== password2) {
			//Add alert to state
			dispatch(setAlert({ msg: "passwords do not match", type: "danger" }))
			//Delete the alert after a specific time
			setTimeout(() => dispatch(removeAlert(0)), 2000)
		} else {
			const newUser = {
				name,
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
					errors.forEach(error => {
						dispatch(setAlert({ msg: error.msg, type: 'danger' }))
						//Remove the alert state after 2 seconds
						setTimeout(() => dispatch(removeAlert(0)), 2000)
					});
				}
				dispatch(setRegisterFail())
				console.error(error.response.data)
			}

		}
	}

	return (
		<Fragment>
			<h1 className="large text-primary">Sign Up</h1>
			<p className="lead">
				<i className="fas fa-user"></i> Create Your Account
			</p>
			<form className="form" onSubmit={(e) => handleRegister(e)}>
				<div className="form-group">
					<input
						type="text"
						placeholder="Name"
						name="name"
						value={name}
						onChange={(e) => onInputChange(e)}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="email"
						placeholder="Email Address"
						name="email"
						value={email}
						onChange={(e) => onInputChange(e)}
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
						onChange={(e) => onInputChange(e)}
						required
						minLength="6"
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Confirm Password"
						name="password2"
						value={password2}
						onChange={(e) => onInputChange(e)}
						required
						minLength="6"
					/>
				</div>
				<input type="submit" className="btn btn-primary" value="Register" />
			</form>
			<p className="my-1">
				Already have an account? <Link to="/login">Sign In</Link>
			</p>
		</Fragment>
	)
}

Register.propTypes = {
	setAlert: PropTypes.func.isRequired
}

export default Register
