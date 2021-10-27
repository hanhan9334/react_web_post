const express = require("express")
const router = express.Router()
const request = require("request")
const config = require("config")
const { check, validationResult } = require("express-validator")
const { initParams } = require("request")
const auth = require("../../middleware/auth")
const Profile = require("../../models/Profile")
const User = require("../../models/User")

//@route   GET api/profile/me
//@desc    Get cuerrent user profile
//@access  Private
router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id }).populate(
			"user",
			["name", "avatar"]
		)
		if (!profile) {
			return res.status(400).json({ msg: "There is no profile for this user" })
		}
		res.json(profile)
	} catch (err) {
		console.log(err.message)
		res.status(500).send("Server Error")
	}
})

//@route   POST api/profile
//@desc    Create or update profile
//@access  Private
router.post(
	"/",
	[
		auth,
		[
			check("status", "Status is required").not().isEmpty(),
			check("skills", "Skills is required").not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() })
		}

		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin
		} = req.body

		//build profile object
		const profileField = {}
		profileField.user = req.user.id
		if (company) profileField.company = company
		if (website) profileField.website = website
		if (location) profileField.location = location
		if (bio) profileField.bio = bio
		if (status) profileField.status = status
		if (githubusername) profileField.githubusername = githubusername
		if (skills) {
			profileField.skills = skills.split(",").map((skill) => skill.trim())
		}

		//build social objet
		profileField.social = {}
		if (twitter) profileField.social.twitter = twitter
		if (youtube) profileField.social.youtube = youtube
		if (facebook) profileField.social.facebook = facebook
		if (linkedin) profileField.social.linkedin = linkedin
		if (instagram) profileField.social.instagram = instagram

		try {
			let profile = await Profile.findOne({ user: req.user.id })
			if (profile) {
				console.log("profile found")
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileField },
					{ new: true }
				)
				return res.status(200).json(profile)
			}

			//Create a new profile
			profile = new Profile(profileField)
			await profile.save()
			console.log("saved")
			return res.json(profile)
		} catch (err) {
			console.log(err.message)
			res.status(500).send("Server error")
		}
	}
)

//@route   GET api/profile
//@desc    Get all profiles
//@access  Public
router.get("/", async (req, res) => {
	try {
		const profiles = await Profile.find().populate("user", ["name", "avatar"])
		res.json(profiles)
	} catch (error) {
		res.status(500).send("Server Error")
	}
})

//@route   GET api/profile/user/:user_id
//@desc    Get profile by user id
//@access  Public
router.get("/user/:user_id", async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id
		}).populate("user", ["name", "avatar"])
		if (!profile) {
			return res.status(400).json({ msg: "No profile of the user" })
		}
		res.json(profile)
	} catch (error) {
		if (error.kind == "ObjectId") {
			return res.status(400).json({ msg: "User not found" })
		}
		res.status(500).send("Server Error")
	}
})

//@route   DELETE api/profile
//@desc    Delete all profiles
//@access  Private
router.delete("/", auth, async (req, res) => {
	try {
		await Profile.findOneAndDelete({ user: req.user.id })
		await User.findByIdAndDelete(req.user.id)

		res.json({ msg: "deleted" })
	} catch (error) {
		res.status(500).send("Server Error")
	}
})

//@route   PUT api/profile/exprience
//@desc    Add profile experience
//@access  Private
router.put(
	"/experience",
	[
		auth,
		[
			check("title", "Title is required").not().isEmpty(),
			check("company", "Company is required").not().isEmpty(),
			check("from", "From date is required").not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		const { title, company, location, from, to, current, description } =
			req.body
		const newExperience = {
			title,
			company,
			location,
			from,
			to,
			current,
			description
		}

		try {
			const profile = await Profile.findOne({ user: req.user.id })
			profile.experience.unshift(newExperience)
			await profile.save()
			res.json(profile)
		} catch (error) {
			console.log(error.message)
			res.status(500).send("Server error")
		}
	}
)

//@route   DELETE api/profile/exprience/:exp_id
//@desc    Delete profile experience
//@access  Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id
		})
		console.log(profile)
		//Get remove index
		const removeIndex = profile.experience
			.map((item) => item.id)
			.indexOf(req.params.exp_id)

		profile.experience.splice(removeIndex, 1)
		await profile.save()
		res.json(profile)
	} catch (error) {
		console.error(error.message)
		res.status(500).json({ msg: "Server error" })
	}
})

//@route   DELETE api/profile
//@desc    Delete all profiles
//@access  Private
router.delete("/", auth, async (req, res) => {
	try {
		await Profile.findOneAndDelete({ user: req.user.id })
		await User.findByIdAndDelete(req.user.id)

		res.json({ msg: "deleted" })
	} catch (error) {
		res.status(500).send("Server Error")
	}
})

//@route   PUT api/profile/educatioin
//@desc    Add profile education
//@access  Private
router.put(
	"/education",
	[
		auth,
		[
			check("school", "School is required").not().isEmpty(),
			check("degree", "Degree is required").not().isEmpty(),
			check("fieldofstudy", "Field of study is required").not().isEmpty(),
			check("from", "From date is required").not().isEmpty()
		]
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		const { school, degree, fieldofstudy, from, to, current, description } =
			req.body
		const newEducation = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description
		}

		try {
			const profile = await Profile.findOne({ user: req.user.id })
			profile.education.unshift(newEducation)
			await profile.save()
			res.json(profile)
		} catch (error) {
			console.log(error.message)
			res.status(500).send("Server error")
		}
	}
)

//@route   DELETE api/profile/exprience/:exp_id
//@desc    Delete profile experience
//@access  Private
router.delete("/education/:edu_id", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id
		})
		console.log(profile)
		//Get remove index
		const removeIndex = profile.education
			.map((item) => item.id)
			.indexOf(req.params.edu_id)

		profile.education.splice(removeIndex, 1)
		await profile.save()
		res.json(profile)
	} catch (error) {
		console.error(error.message)
		res.status(500).json({ msg: "Server error" })
	}
})

//@route   GET api/profile/github/:user_id
//@desc    Get repo by user id
//@access  Public

router.get("/github/:username", (req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${
				req.params.username
			}/repos?per_page=5&sort=created:asc&client_id=${config.get(
				"githubClientId"
			)}&client_secret=${config.get("githubSecret")}`,
			//uri: `https://api.github.com/users/${req.params.username}/repos`,
			method: "GET",
			headers: {
				"user-agent": "node.js"
			}
		}

		request(options, (error, response, body) => {
			if (error) {
				console.log(error)
			}
			if (response.statusCode !== 200) {
				return res.status(404).json({ msg: "Git profile not found" })
			}
			res.json(JSON.parse(body))
		})
	} catch (error) {
		res.status(500).json({ msg: "Server error" })
	}
})

module.exports = router
