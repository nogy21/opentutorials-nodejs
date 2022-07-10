const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
	const post = req.body;
	const option = { "Max-Age": 0 };
	res.cookie("email", option);
	res.cookie("password", option);
	res.cookie("nickname", option);
	res.redirect("/");
});

module.exports = router;
