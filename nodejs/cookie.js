const http = require("http");
const cookie = require("cookie");
http.createServer((req, res) => {
	console.log(req.headers.cookie);
	const cookies =
		req.headers.cookie === undefined
			? {}
			: cookie.parse(req.headers.cookie);
	console.log(cookies.yummy_cookie);
	res.writeHead(200, {
		"Set-Cookie": [
			"yummy_cookie = choco",
			"tasty_cookie = strawberry",
			`PermanentCookie = lemon; Max-Age = ${60 * 60 * 24 * 30}`,
			"SecureCookie = Secure",
			"HttpOnly = HttpOnly; HttpOnly",
		],
	});
	res.end("Cookie!!");
}).listen(3000);
