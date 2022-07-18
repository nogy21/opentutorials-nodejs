const express = require('express');
const app = express();
const fs = require('fs');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('connect-flash');
const db = require('./lib/db');

// cookie-parser
app.use(cookieParser());
// security
app.use(helmet());
// static
app.use(express.static('public'));
// body-parser
app.use(express.urlencoded({ extended: false }));
// comepression
app.use(compression());
// session
app.use(
  session({
    secret: 'asdfzxcv!@#$%ASDF',
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);
// flash
app.use(flash());

// passport
const passport = require('./lib/passport')(app);

// application-level middleware
app.get('*', (req, res, next) => {
  req.list = db.get('topics').take(100).value();
  next();
});

// Router
const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const authRouter = require('./routes/auth')(passport);

// route
app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/auth', authRouter);

app.use(function (req, res, next) {
  res.status(404).send('Not found');
});

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send('Somthing broke!');
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
//         var list = template.list(list);
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
