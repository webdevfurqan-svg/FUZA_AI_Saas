const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const requireLogin = require('../middleware/auth');

const router = express.Router();


router.get('/register', (req, res) => {
  res.render('register', { error: null });
});


router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
  
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {

      return res.render('register', { error: 'An account with this email already exists.' });
    }


    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      email: email,
      passwordHash: passwordHash
      
    });

    await newUser.save();


    req.session.userId = newUser._id.toString();
    res.redirect('/chat');

  } catch (err) {
    console.log(err);
    res.render('register', { error: 'Something went wrong. Please try again.' });
  }
});


router.get('/login', (req, res) => {
  res.render('login', { error: null });
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.render('login', { error: 'Invalid email or password.' });
    }


    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.render('login', { error: 'Invalid email or password.' });
    }

    req.session.userId = user._id.toString();
    res.redirect('/chat');

  } catch (err) {
    console.log(err);
    res.render('login', { error: 'Something went wrong. Please try again.' });
  }
});


router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});


router.get('/profile', requireLogin, async (req, res) => {
  const user = await User.findById(req.session.userId);

  if (!user) {
    return res.redirect('/login');
  }

  res.render('profile', { user: user });
});

module.exports = router;