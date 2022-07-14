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

/*

router.get('/update/:pageId', (req, res) => {
  if (checkCookie(req, res)) {
    const filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
      const title = req.params.pageId;
      const list = template.list(req.list);
      const loginUI = req.app.locals.authStatusUI(req, res);
      const html = template.HTML(
        title,
        list,
        `<form action="/topic/update" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>`,
        `<a href="/create">create</a> <a href="/topic/update/${title}">update</a>`,
        loginUI
      );
      res.send(html);
    });
  }
});

router.post('/update', (req, res) => {
  if (checkCookie(req, res)) {
    const post = req.body;
    const id = post.id;
    const title = post.title;
    const description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function (error) {
      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        res.redirect(`/topic/${title}`);
      });
    });
  }
});

router.post('/delete', (req, res) => {
  checkCookie(req, res);
  const post = req.body;
  const id = post.id;
  const filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function (error) {
    res.redirect('/');
  });
});

router.get('/:pageId', (req, res, next) => {
  const filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    if (err) {
      next(err);
    }
    const title = req.params.pageId;
    const sanitizedTitle = sanitizeHtml(title);
    const sanitizedDescription = sanitizeHtml(description, {
      allowedTags: ['h1'],
    });
    const list = template.list(req.list);
    const loginUI = req.app.locals.authStatusUI(req, res);
    const html = template.HTML(
      sanitizedTitle,
      list,
      `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
      `<a href="/topic/create">create</a>
            <a href="/topic/update/${sanitizedTitle}">update</a>
            <form action="/topic/delete" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
            </form>`,
      loginUI
    );
    res.send(html);
  });
});
*/

module.exports = router;
