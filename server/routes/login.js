const router = require('express').Router();
const passport = require('passport');
const connection = require('../config/database').connection;
const User = connection.models.User;
const genPassword = require('../lib/passwordTools').genPassword;
const { isAuth } = require('../Middleware/authMiddleware');
router.get('/d', (req, res) => {
  res.send('ROUTER');
});
router.post('/register', (req, res) => {
  var { firstName, lastName, userName, password } = req.body;
  if (password.length < 8) {
    return res.status(400).json({
      succes: false,
    });
  }
  const saltHash = genPassword(password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    firstName: firstName,
    lastName: lastName,
    userName: userName,
    hash: hash,
    salt: salt,
  });

  newUser.save().then((user) => {
    console.log(user);
  });

  res.status(200).json({ succes: true });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/login-success',
    failureRedirect: '/login-failure',
  }),
  (req, res) => {
    res.json({ succes: true });
  }
);

router.get('/login-success', (req, res) => {
  res.status(200).json({
    logged: true,
  });
});

router.get('/login-failure', (req, res) => {
  res.status(200).json({
    logged: false,
  });
});

router.get('/checklogin', isAuth, (req, res) => {
  console.log('u logges');
  res.json({ succes: true });
});

router.get('/google-succes', (req, res) => {
  res.json({
    succes: true,
    type: 'GOOGLE',
  });
});

module.exports = router;
