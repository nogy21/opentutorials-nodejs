const express = require('express');
const router = express.Router();
const path = require('node:path');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');
const template = require('../lib/template');
const { nextTick } = require('node:process');

module.exports = function (passport) {
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
      <form action="/auth/register" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="pwd" placeholder="password"></p>
        <p><input type="password" name="pwd2" placeholder="password"></p>
        <p><input type="text" name="displayName" placeholder="display name"></p>
        <p>
          <input type="submit" value="register">
        </p>
      </form>
      `,
      ''
    );
    res.send(html);
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
