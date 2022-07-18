const db = require('./db');

module.exports = function (app) {
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
    done(null, user.id);
  });
  // 로그인 여부 판단. 저장된 데이터를 기준으로 필요 정보 조회
  passport.deserializeUser(function (id, done) {
    const user = db.get('users').find({ id: id }).value();
    console.log('deserializeUser', id, user);
    done(null, user); // 사용자 실제 데이터(보통 DB에서 조회). req.user 주입
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
            // 데이터 일치 시 두 번째 인자로 사용자 실제 데이터 전달
            // done 호출 시 serializeUser의 콜백 함수 호출
            return done(null, authData, {
              message: 'Welcome.',
            });
          } else {
            return done(null, false, {
              message: 'Incorrect password.',
            });
          }
        } else {
          return done(null, false, {
            message: 'Incorrect username.',
          });
        }
      }
    )
  );
  return passport;
};
