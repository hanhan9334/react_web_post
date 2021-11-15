import React, { Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { setLogout } from "../../features/authSlice"

const Navbar = () => {
	//Get auth from Redux
	const auth = useSelector((state) => state.auth)
	const { token, isAuthenticated, loading, user } = auth.value

	//Set dispatch for Redux
	const dispatch = useDispatch()

	const handleLogout = () => {
		dispatch(setLogout())
	}

	const authLinks = (
		<li>
			<a onClick={handleLogout} href="#!">
				<i className="fas fa-sign-out-alt"></i>
				<span className="hide-sm">Log out</span>
			</a>
		</li>
	)

	const guestLinks = (
		<ul>
			<li>
				<Link to="/register">Developers</Link>
			</li>
			<li>
				<Link to="/register">Register</Link>
			</li>
			<li>
				<Link to="/login">Login</Link>
			</li>
		</ul>
	)

	return (
		<nav className="navbar bg-dark">
			<h1>
				<a href="index.html">
					<i className="fas fa-code"></i> DevConnector
				</a>
			</h1>
			{!loading && (
				<Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
			)}
		</nav>
	)
}

export default Navbar
