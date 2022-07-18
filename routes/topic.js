const express = require('express');
const router = express.Router();
const path = require('node:path');
const sanitizeHtml = require('sanitize-html');
const qs = require('qs');
const fs = require('fs');
const template = require('../lib/template');
const auth = require('../lib/auth');
const db = require('../lib/db');
const shortid = require('shortid');

router.get('/create', (req, res) => {
  if (!auth.isOwner(req, res)) {
    res.redirect('/');
    return false;
  }
  const title = 'WEB - create';
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    list,
    `<form action="/topic/create" method="post">
    <p><input type="text" name="title" placeholder="title"></p>
    <p>
        <textarea name="description" placeholder="description"></textarea>
    </p>
    <p>
        <input type="submit">
    </p>
    </form>`,
    '',
    auth.statusUI(req, res)
  );
  res.send(html);
});

router.post('/create', (req, res) => {
  if (!auth.isOwner(req, res)) {
    res.redirect('/');
    return false;
  }
  const post = req.body;
  const title = post.title;
  const description = post.description;
  const id = shortid.generate();
  db.get('topics')
    .push({
      id: id,
      title: title,
      description: description,
      user_id: req.user.id,
    })
    .write();
  res.redirect(`/topic/${id}`);
});

router.get('/update/:pageId', (req, res) => {
  if (!auth.isOwner(req, res)) {
    res.redirect('/');
    return false;
  }
  const filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
    const title = req.params.pageId;
    const list = template.list(req.list);
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
      auth.statusUI(req, res)
    );
    res.send(html);
  });
});

router.post('/update', (req, res) => {
  if (!auth.isOwner(req, res)) {
    res.redirect('/');
    return false;
  }
  const post = req.body;
  const id = post.id;
  const title = post.title;
  const description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function (error) {
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      res.redirect(`/topic/${title}`);
    });
  });
});

router.post('/delete', (req, res) => {
  if (!auth.isOwner(req, res)) {
    res.redirect('/');
    return false;
  }
  const post = req.body;
  const id = post.id;
  const filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function (error) {
    res.redirect('/');
  });
});

router.get('/:pageId', (req, res, next) => {
  const topic = db.get('topics').find({ id: req.params.pageId }).value();
  const user = db.get('users').find({ id: topic.user_id }).value();
  const sanitizedTitle = sanitizeHtml(topic.title);
  const sanitizedDescription = sanitizeHtml(topic.description, {
    allowedTags: ['h1'],
  });
  const list = template.list(req.list);
  const html = template.HTML(
    sanitizedTitle,
    list,
    `
    <h2>${sanitizedTitle}</h2>
    ${sanitizedDescription}
    <p>by ${user.displayName}</p>
    `,
    `<a href="/topic/create">create</a>
      <a href="/topic/update/${sanitizedTitle}">update</a>
      <form action="/topic/delete" method="post">
          <input type="hidden" name="id" value="${sanitizedTitle}">
          <input type="submit" value="delete">
      </form>`,
    auth.statusUI(req, res)
  );
  res.send(html);
});

module.exports = router;
