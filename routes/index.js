const express = require('express');
const router = express.Router();
const template = require('../lib/template');
const auth = require('../lib/auth');

router.get('/', (req, res) => {
  console.log('/', req.user);
  const title = 'Welcome';
  const description = 'Hello, Node.js';
  const list = template.list(req.list);
  const html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${description}
        <img src="/images/hello.jpg" style="width:500px; display:block; margin:10px;">
        `,
    `<a href="/topic/create">create</a>`,
    auth.statusUI(req, res)
  );
  res.send(html);
});

module.exports = router;
