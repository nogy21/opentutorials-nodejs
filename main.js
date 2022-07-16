const express = require('express');
const app = express();
const fs = require('fs');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

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

// passport
const authData = {
  email: 'nogy21@gmail.com',
  password: '1111', // 비밀번호는 소스코드 바깥 쪽에 위치해야 함. 또한, hash나 암호 알고리즘 적용 필수
  nickname: 'yong',
};

const passport = require('passport'),
  LocalStratedy = require('passport-local').Strategy;

app.use(passport.initialize()); // express에 passport 등록
app.use(passport.session()); // 내부적으로 session 사용

// 세션 처리 방법
// local 정책에서 사용자 정보 전달받음. 로그인 성공 시 sessionStore에 저장
passport.serializeUser(function (user, done) {
  console.log('serializeUser', user);
  // 사용자 식별값을 추출해 done 호출 시 세션 데이터의 passport.user에 저장
  done(null, user.email);
});
// 로그인 여부 판단. 저장된 데이터를 기준으로 필요 정보 조회
passport.deserializeUser(function (id, done) {
  console.log('deserializeUser', id);
  done(null, authData); // 사용자 실제 데이터(보통 DB에서 조회)
});

passport.use(
  new LocalStratedy( // local 전략
    {
      usernameField: 'email',
      passwordField: 'pwd',
    },
    function (username, password, done) {
      console.log('LocalStrategy', username, password);
      if (username === authData.email) {
        console.log(1);
        if (password === authData.password) {
          console.log(2);
          // 데이터 일치 시 두 번째 인자로 사용자 실제 데이터 전달
          // done 호출 시 serializeUser의 콜백 함수 호출
          return done(null, authData);
        } else {
          console.log(3);
          return done(null, false, {
            message: 'Incorrect password.',
          });
        }
      } else {
        console.log(4);
        return done(null, false, {
          message: 'Incorrect username.',
        });
      }
    }
  )
);

app.post(
  '/auth/login',
  // local 전략 사용
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
  })
);

// application-level middleware
app.get('*', (req, res, next) => {
  fs.readdir('./data', function (error, list) {
    req.list = list;
    next();
  });
});

// Router
const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const authRouter = require('./routes/auth');
const { application } = require('express');

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
