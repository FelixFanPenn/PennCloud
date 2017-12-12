const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy({
  // options for the strategy
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/auth/google/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    //console.log(profile);

    // check if user exists in mongodb
    User.findOne({
      userid: profile.id, provider: 'google'}
    ).then((curUser) => {
      if (curUser) {
        // already exists
        console.log('user is ', curUser);
        done(null, curUser);
      } else {
        console.log(profile);
        new User({
          username: profile.displayName,
          userid: profile.id,
          provider: 'google',
          thumbnail: profile._json.image.url,
          email: profile.emails[0].value
        }).save().then((newUser) => {
          console.log("new user created: " + newUser);
          done(null, newUser);
        });
      }
    });
  }
));


passport.use(
  new FacebookStrategy({
  // options for the strategy
    callbackURL: '/auth/facebook/redirect',
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'birthday']
  },(accessToken, refreshToken, public_profile, done) => {
    //console.log(public_profile);

    // check if user exists in mongodb
    User.findOne({
      userid: public_profile.id, provider: 'facebook'}
    ).then((curUser) => {
      if (curUser) {
        // already exists
        console.log('user is ', curUser);
        done(null, curUser);
      } else {
        console.log(public_profile);
        new User({
          username: public_profile.name.familyName + " " + public_profile.name.givenName ,
          userid: public_profile.id,
          provider: 'facebook',
          thumbnail: 'null',
          email: public_profile.emails[0].value
        }).save().then((newUser) => {
          console.log("new user created: " + newUser);
          done(null, newUser);
        });
      }
    });
  }
));
