var Express = require('express');
var Session = require('express-sessions');
var Passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var port = 8890;

var App = Express();

App.use(Session({secret: 'facebook auth stuff'}));
App.use(Passport.initialize());
App.use(Passport.session());

Passport.serializeUser(function (user, done) {
  done(null, user);
});

Passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

Passport.use(new FacebookStrategy({
  clientID: '',
  clientSecret: '',
  callbackURL: 'http://localhost:8890/auth/facebook/callback'
}, function (token, refreshToken, profile, done) {
  return done(null, profile);
}));

var requireAuth = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }else {
    return res.redirect('/auth/facebook')
  }
};

App.get('/auth/facebook', Passport.authenticate('facebook'));

App.get('/auth/facebook/callback', Passport.authenticate('facebook', {
  failureRedirect: '/login'
  successRedirect: '/me'
}), function (req, res) {
  console.log(req.session);
});

App.get('/me', function (req, res) {
  if (req.user) {
    res.status(200).send(JSON.stringify(req.user));
  }else {
    res.send('Please login');
  }
});





App.listen(port, function () {
  console.log('listening on port' + port);
});




