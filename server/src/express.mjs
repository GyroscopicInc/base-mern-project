import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import passport from 'passport';

import indexRouter from './routes/index.mjs';
import authroutes from './routes/auth.mjs';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

// passport config
require('./config/passport')(passport);

// express session
app.use(
  session({
    secret: 'SOME_SORT_OF_SECRET',
    resave: true,
    saveUninitialized: true,
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/auth', authroutes);

export default app;
