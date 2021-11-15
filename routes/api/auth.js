const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const gravatar = require("gravatar")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const { check, validationResult } = require("express-validator")

const User = require("../../models/User")

//@route   GET api/auth
//@desc    Test route
//@access  Public
router.get("/", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password")
		res.json(user)
	} catch (err) {
		console.log(err.message)
		res.status(500).json({ msg: "User not authenticated" })
	}
})

//@route   POST api/auth
//@desc    Authenticate user and get token
//@access  Public
router.post(
	"/",
	[
		check("email", "Please include a valid email").isEmail(),
		check("password", "password is required").exists()
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { name, email, password } = req.body

		try {
			let user = await User.findOne({ email })
			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid credentials" }] })
			}

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid credentials" }] })
			}

			const payload = {
				user: {
					id: user.id
				}
			}
			try {
				token = await jwt.sign(payload, config.get("jwtSecret"), {
					expiresIn: 36000000
				})
				const respondUser = {_id:user._id,email:user.email,name:user.name}
				return res.json({user: respondUser, token })
			} catch (err) {
				return res.status(500).json({ msg: "Token not generated" })
			}
		} catch (err) {
			return res.status(500).json({ msg: "Server Error" })
		}
	}
)

module.exports = router
