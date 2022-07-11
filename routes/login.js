const express = require('express');
const router = express.Router();
const template = require('../lib/template');

router.get('/', (req, res) => {
  const title = 'Login';
  const description = 'Hello, Node.js';
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    description,
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

router.post('/', (req, res) => {
  const post = req.body;
  if (post.email === 'nogy21@gmail.com' && post.password === '1111') {
    res.cookie('email', post.email);
    res.cookie('password', post.password);
    res.cookie('nickname', 'nogy21');
    res.redirect('/');
  } else {
    res.send('Who?');
  }
});

module.exports = router;
