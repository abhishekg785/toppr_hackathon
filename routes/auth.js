var express = require('express');
var router = express.Router();

function checkLogin(req, res, next){
  if(req.session && req.session.username){
    res.redirect('/search-panel');
  }
  else{
    next();
  }
}

router.get('/', checkLogin, function(req, res){
  res.redirect('/auth/login');
});

router.get('/login', checkLogin, function(req, res){
  res.render('auth/login.html', {'error' : ''});
});

router.post('/login', function(req, res){
  var username = req.body.username;
  if(username == ''){
    res.render('auth/login.html', {'error' : 'Username is required'});
  }
  else{
    req.session.username = username
    console.log(req.session.username);
    res.redirect('/search-panel');
  }
});

router.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
