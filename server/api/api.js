var passport =require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
var jwt = require("jsonwebtoken");
var api = require("express").Router({caseSensitive: true, strict: true});
var uid = require("uid2");
var config = require("../config/config");
var User = require("./models/User");
var Question = require("./models/Question");

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(obj, done) {
  return done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
    callbackURL: config.FACEBOOK_APP_CALLBACK,
    passReqToCallback : true
  },
  function (req, accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      User.findOrCreate({facebookId: profile.id}, {
        id: uid(16),
        facebookId: profile.id,
        facebookData: profile,
        createdAt: new Date
      },function (err, user){
        if (err) {
          return done(err);
        }
        return done(null, user);
      });
    });
  }
));


api.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

api.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect : '/'
}));

api.get('/token', function (req, res) {
  if (!req.user) {
    return res.json({
      authenticated: false,
      token: null
    });
  }
  var token = jwt.sign({user: req.user.id}, 'sacascasc');
  return res.json({
    authenticated: true,
    token: token,
    user: req.user._json
  });

});

api
  .get('/questions', function (req, res) {
    var cid = req.query.cid;
    var pid = req.query.pid;
    if (!cid && !pid) {
      return res.json({
        status: 'failed',
        message: 'Must include cid and pid'
      });
    }
    Question.find({cid: cid, pid:pid}, function (err, questions) {
      if (err) {
        return res.error(err.stack);
      }
      return res.json({
        status: 'success',
        data: questions
      });
    });
  })
  .post('/questions', function (req, res) {
    var newQuestion = req.body.question;

    if(!req.user) {
      return res.json({
        status: 'failed',
        message: 'Not authenticated'
      });
    }
    var createdAt = new Date();
    Question.findOrCreate({title: newQuestion.title, cid: newQuestion.cid, pid: newQuestion.pid}, {
      id: uid(16),
      cid: newQuestion.cid,
      pid: newQuestion.pid,
      title: newQuestion.title,
      content: newQuestion.content,
      author: newQuestion.author,
      signatures: [{
        uid: newQuestion.author,
        timestamp: createdAt.getTime()
      }],
      createdAt: createdAt
    }, function (err, question) {
      if (err) {
        return res.error(err.stack);
      }
      return res.json({
        status: 'success',
        data: question
      });
    });
});


module.exports = api;