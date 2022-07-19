const db = require('./db');
const bcrypt = require('bcrypt');

module.exports = function passport(app) {
  const passport = require('passport'),
    LocalStratedy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth20').Strategy;

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
      function (email, password, done) {
        console.log('LocalStrategy', email, password);
        const user = db.get('users').find({ email: email }).value();
        if (user) {
          bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
              return done(null, user, {
                message: 'Welcome.',
              });
            } else {
              return done(null, false, {
                message: 'Password is not correct',
              });
            }
          });
        } else {
          return done(null, false, {
            message: 'There is no email',
          });
        }
      }
    )
  );

  const googleCredentials = require('../config/google.json');
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleCredentials.web.client_id,
        clientSecret: googleCredentials.web.client_secret,
        callbackURL: googleCredentials.web.redirect_uris[0],
      },
      function (accessToken, refreshToken, profile, cb) {
        console.log('GoogleStrategy', accessToken, refreshToken, profile);
      }
    )
  );

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['https://www.googleapis.com/auth/plus.login'],
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
    }
  );

  return passport;
};
