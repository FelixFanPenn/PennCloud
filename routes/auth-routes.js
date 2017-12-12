const router = require('express').Router();
const passport = require('passport');

//auth login
router.get('/login', (req, res) => {
  res.render('login', {user: req.user });
});

//auth logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

// auth with google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// auth with facebook
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/profile/');
});

router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/profile/');
});

module.exports = router;
