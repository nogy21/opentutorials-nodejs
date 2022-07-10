const express = require("express");
const router = express.Router();
const template = require("../lib/template");

router.get("/", (req, res) => {
	const title = "Login";
	const description = "Hello, Node.js";
	const list = template.list(req.list);
	const html = template.HTML(
		title,
		list,
		`<form action="login" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="text" name="password" placeholder="password"></p>
            <p><input type="submit"></p>
        </form>`,
		`<a href="/topic/create">create</a>`
	);
	res.send(html);
});

module.exports = router;
