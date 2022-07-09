const express = require('express');
const app = express();
const fs = require('fs');
const template = require('./lib/template.js');
const path = require('node:path');
const sanitizeHtml = require('sanitize-html');
const qs = require('qs');
const compression = require('compression');

// body-parser
app.use(express.urlencoded({ extended: false }));
// comepression
app.use(compression());
// application-level middleware
app.get('*', (req, res, next) => {
  fs.readdir('./data', function (error, filelist) {
    req.list = filelist;
    next();
  });
});

// route, routing
app.get('/', (request, response) => {
  const title = 'Welcome';
  const description = 'Hello, Node.js';
  const list = template.list(req.filelist);
  const html = template.HTML(
    title,
    list,
    `<h2>${title}</h2>${description}`,
    `<a href="/create">create</a>`
  );
  response.send(html);
});

app.get('/page/:pageId', (req, res) => {
  const filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
    const title = req.params.pageId;
    const sanitizedTitle = sanitizeHtml(title);
    const sanitizedDescription = sanitizeHtml(description, {
      allowedTags: ['h1'],
    });
    const list = template.list(req.filelist);
    const html = template.HTML(
      sanitizedTitle,
      list,
      `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
      `<a href="/create">create</a>
              <a href="/update/${sanitizedTitle}">update</a>
              <form action="/delete" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>`
    );
    res.send(html);
  });
});

app.get('/create', (req, res) => {
  const title = 'WEB - create';
  const list = template.list(req.filelist);
  const html = template.HTML(
    title,
    list,
    `<form action="/create" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
          <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
          <input type="submit">
      </p>
    </form>`,
    ''
  );
  res.send(html);
});

app.post('/create', (req, res) => {
  /* before using body-parser
  let body = '';
  req.on('data', (data) => {
    body += data;
    // 1e6 === 1*1000000 ~~~ 1MB
    if (body.length > 1e6) {
      req.connection.destroy();
    }
  });
  req.on('end', () => {
    const post = qs.parse(body);
    const title = post.title;
    const description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      res.writeHead(302, { Location: `/?id=${title}` });
      res.end();
    });
  });
  */
  const post = req.body;
  const title = post.title;
  const description = post.description;
  fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
    res.writeHead(302, { Location: `/?id=${title}` });
    res.end();
  });
});

app.get('/update/:pageId', (req, res) => {
  const filteredId = path.parse(req.params.pageId).base;
  fs.readFile(`data/${filteredId}`, 'utf8', (err, description) => {
    const title = req.params.pageId;
    const list = template.list(req.filelist);
    const html = template.HTML(
      title,
      list,
      `
      <form action="/update" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
        <p>
            <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
            <input type="submit">
        </p>
      </form>
      `,
      `<a href="/create">create</a> <a href="/update/${title}">update</a>`
    );
    res.send(html);
  });
});

app.post('/update', (req, res) => {
  const post = req.body;
  const id = post.id;
  const title = post.title;
  const description = post.description;
  fs.rename(`data/${id}`, `data/${title}`, function (error) {
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      res.redirect(`/?id=${title}`);
    });
  });
});

app.post('/delete', (req, res) => {
  const post = req.body;
  const id = post.id;
  const filteredId = path.parse(id).base;
  fs.unlink(`data/${filteredId}`, function (error) {
    res.redirect('/');
  });
});

app.get('/', (err, req, res) => {
  res.status(404).send('Not found');
});

app.listen(3000, () => console.log('## 3000 Listening ##'));

// var http = require('http');
// var fs = require('fs');
// var url = require('url');
// var qs = require('querystring');
// var template = require('./lib/template.js');

// var app = http.createServer(function (request, response) {
//   var _url = request.url;
//   var queryData = url.parse(_url, true).query;
//   var pathname = url.parse(_url, true).pathname;
//   if (pathname === '/') {
//     if (queryData.id === undefined) {
//         //refactoring
//         var list = template.list(filelist);
//         var html = template.HTML(
//           title,
//           list,
//           `<h2>${title}</h2>${description}`,
//           `<a href="/create">create</a>`
//         );
//         response.writeHead(200);
//         response.end(html);
//       });
//     } else {
//     }
//   } else if (pathname === '/create') {
//   } else if (pathname === `/create_process`) {
//   } else if (pathname === '/update') {
//   } else if (pathname === '/update_process') {
//   } else if (pathname === '/delete_process') {
//   } else {
//   }
// });
// app.listen(3000);
