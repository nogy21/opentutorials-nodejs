// check cookie
function authIsOwner(req, res) {
  let isOwner = false;
  const cookie = req.cookies ?? {};
  if (cookie.email === 'nogy21@gmail.com' && cookie.password === '1111') {
    isOwner = true;
  }
  return isOwner;
}

module.exports.authStatusUI = function authStatusUI(req, res) {
  const isOwner = authIsOwner(req, res);
  let authStatusUI = "<a href='/login'>login</a>";
  if (isOwner) {
    authStatusUI = "<a href='/logout'>logout</a>";
  }
  return authStatusUI;
};

module.exports.checkCookie = (req, res) => {
  if (!authIsOwner(req, res)) {
    res.send('Login required!! <a href="/login">go login</a>');
    return false;
  }
};

module.exports.authIsOwner = authIsOwner;
