const LocalStrategy = require('passport-local').Strategy;
import bcrypt from 'bcryptjs';

import User from '../models/User';

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect email' });

        bcrypt.compare(password, user.password, (err, success) => {
          if (err) throw err;
          if (success) return done(null, user);
          else return done(null, false, { message: 'Incorrect password' });
        });
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
