const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes/login');
const uploadImg = require('./routes/uploadImage/uploadImage');
const image = require('./routes/UPLOAD/upload');
const connection = require('./config/database');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const fileupload = require('express-fileupload');

require('dotenv').config();

// Create the Express application
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MongoStore({
  mongoUrl: process.env.DB_STRING,
  collection: 'sessions',
});

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
    sameSite: 'None',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.DB_STRING,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Equals 1 day (1 day * 24 hr/1 day * 60 min/1 hr * 60 sec/1 min * 1000 ms / 1 sec)
    },
  })
);

require('./config/passport');
app.use(passport.initialize());
app.use(passport.session());

// app.use((req, res, next) => {
//   console.log(req.session);
//   console.log(req.user);
//   next();
// });

app.use(routes);

app.get('/', (req, res) => {
  res.send('Hello niggas');
});
app.use('/image', image);
app.use(fileupload());
app.use('/upload', uploadImg);

app.listen(3001, () => {
  console.log('App running on port 3001');
});
