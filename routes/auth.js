const express = require('express');
const router = express.Router();
const fs = require('fs');
const template = require('../lib/template');
const shortid = require('shortid');
const db = require('../lib/db');

module.exports = function auth(passport) {
  router.get('/login', (req, res) => {
    const fmsg = req.flash();
    let feedback = '';
    if (fmsg.message) {
      feedback = fmsg.message[0];
    }
    const title = 'WEB - login';
    const list = template.list(req.list);
    const html = template.HTML(
      title,
      list,
      `
      <div style="color:red;">${feedback}</div>
      <form action="/auth/login" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="pwd" placeholder="password"></p>
        <p>
          <input type="submit" value="login">
        </p>
      </form>
      `,
      ''
    );
    res.send(html);
  });

  router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (req.session.flash) {
        req.session.flash = {};
      }
      req.flash('message', info.message);
      req.session.save(() => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.redirect('/auth/login');
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          return req.session.save(() => {
            res.redirect('/');
          });
        });
      });
    })(req, res, next);
  });

  router.get('/register', (req, res) => {
    const fmsg = req.flash();
    let feedback = '';
    if (fmsg.error) {
      feedback = fmsg.error[0];
    }
    const title = 'WEB - login';
    const list = template.list(req.list);
    const html = template.HTML(
      title,
      list,
      `
      <div style="color:red;">${feedback}</div>
      <form action="/auth/register" method="post">
        <p><input type="text" name="email" placeholder="email" value="nogy21@gmail.com"></p>
        <p><input type="password" name="pwd" placeholder="password" value="1111"></p>
        <p><input type="password" name="pwd2" placeholder="password" value="1111"></p>
        <p><input type="text" name="displayName" placeholder="display name" value="nogy"></p>
        <p>
          <input type="submit" value="register">
        </p>
      </form>
      `,
      ''
    );
    return res.send(html);
  });

  router.post('/register', (req, res, next) => {
    const post = req.body;
    const email = post.email;
    const pwd = post.pwd;
    const pwd2 = post.pwd2;
    const displayName = post.displayName;
    if (pwd !== pwd2) {
      req.flash('error', 'Password must same!');
      res.redirect('/auth/register');
    } else {
      // 아직 암호화 처리 X
      const user = {
        id: shortid.generate(),
        email: email,
        password: pwd,
        displayName: displayName,
      };
      db.get('users').push(user).write();
      req.login(user, function (err) {
        console.log('redirect');
        return res.redirect('/');
      });
    }
  });

  router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.session.save(function () {
        res.redirect('/');
      });
    });
    // req.session.destroy(function (err) {
    //   res.redirect('/');
    // });
  });
  return router;
};
