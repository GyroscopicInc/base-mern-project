import express from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';

import User from '../models/User';

const router = express.Router();

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/**
 * @route   POST api/users/login
 * @desc    user login
 * @access  public
 */
router.post('/login', async (req, res, next) => {
  await passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user)
      return res.status(401).send({
        message: 'User does not exist',
      });

    req.logIn(user, (err) => {
      if (err) return next(err);

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    });
  })(req, res, next);
});

/**
 * @route   GET api/users/logout
 * @desc    user logout
 * @access  public
 */
router.get('/logout', async (req, res) => {
  req.logout();
  res.json({ message: 'Logout success' });
});

// @route   POST api/users/register
// @desc    register a new user
// @access  public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(422).json({ msg: 'Please enter all fields' });

  // check for existing user
  await User.findOne({ email }).then((user) => {
    if (user) res.status(422).json({ msg: 'User already exists' });

    const newUser = new User({
      name,
      email,
      password,
    });

    // hash and salt
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;

        newUser.password = hash;
        newUser.save().then((user) => {
          res.json({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
            },
          });
        });
      });
    });
  });
});

export default router;
