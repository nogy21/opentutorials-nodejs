const express = require('express');
const parseurl = require('parseurl');
const session = require('express-session');

const app = express();

app.use(
  // session store instance: default - MemoryStore instance => memory는 휘발성이기에 서버가 꺼지면 데이터 out
  session({
    // session middleware로 req 객체 프로퍼티로 session 생성
    secret: 'keyboard cat', // 공개되어서는 안되는 비밀 키
    resave: false, // session data가 바뀌기 전 까지는 저장하지 않는다
    saveUninitialized: true, // session이 필요하기 전 까지는 초기화하지 않는다
  })
);

app.get('/', (req, res, next) => {
  console.log(req.session);
  req.session.num = req.session.num === undefined ? 1 : req.session.num + 1;
  res.send(`Views: ${req.session.num}`);
});

app.listen(3000, () => {
  console.log('3000!');
});
