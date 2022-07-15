const express = require('express');
const router = express.Router();
const path = require('node:path');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
const template = require('../lib/template');

router.get('/login', (req, res) => {
  const title = 'WEB - login';
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    list,
    `<form action="/auth/login" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>
      <p>
          <input type="submit" value="login">
      </p>
    </form>`,
    ''
  );
  res.send(html);
});

// router.post('/login', (req, res) => {
//   const post = req.body;
//   const email = post.email;
//   const password = post.pwd;
//   if (email === authData.email && password === authData.password) {
//     req.session.is_logined = true;
//     req.session.nickname = authData.nickname;
//     res.session.save(); // session store에 즉각 저장
//     res.redirect('/');
//   } else {
//     res.send('Who?');
//   }
// });

router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

module.exports = router;
