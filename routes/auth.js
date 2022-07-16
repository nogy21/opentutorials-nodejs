const express = require('express');
const router = express.Router();
const path = require('node:path');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
const template = require('../lib/template');
const { nextTick } = require('node:process');

router.get('/login', (req, res) => {
  const fmsg = req.flash();
  let feedback = '';
  if (fmsg.message) {
    feedback = fmsg.message[0];
  }
  const title = 'WEB - login';
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    list,
    `<div style="color:red;">${feedback}</div>
      <form action="/auth/login" method="post">
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

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.save(function () {
      res.redirect('/');
    });
  });
  // req.session.destroy(function (err) {
  //   res.redirect('/');
  // });
});

module.exports = router;
