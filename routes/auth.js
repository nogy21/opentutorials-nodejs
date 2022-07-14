const express = require('express');
const router = express.Router();
const path = require('node:path');
const sanitizeHtml = require('sanitize-html');
// const qs = require('qs');
const fs = require('fs');
const template = require('../lib/template');
// const { checkCookie } = require('../nodejs/cookieFunc');

const authData = {
  email: 'nogy21@gmail.com',
  password: '1111', // 비밀번호는 소스코드 바깥 쪽에 위치해야 함. 또한, hash나 암호 알고리즘 적용 필수
  nickname: 'yong',
};

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
  // }
});

router.post('/login', (req, res) => {
  const post = req.body;
  const email = post.email;
  const password = post.pwd;
  if (email === authData.email && password === authData.password) {
    req.session.is_logined = true;
    req.session.nickname = authData.nickname;
    res.redirect('/');
  } else {
    res.send('Who?');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

module.exports = router;
