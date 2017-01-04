/**
 * module dependencies for express configuration
 */
const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

/**
 * express configuration
 */
const expressConfig = (app, passport, serverConfigs) => {

  // apply gzip compression (should be placed before express.static)
  app.use(compress());

  // log server requests to console
  app.use(morgan('dev'));

  // get data from html froms
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // read cookies (should be above session)
  app.use(cookieParser());
  app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'secret',
    store: new mongoStore({
      url: serverConfigs.DBURL,
      collection : 'sessions'
    })
  }));

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  // connect flash for flash messages (should be declared after sessions)
  app.use(flash());

  // apply development environment additionals
  if (!serverConfigs.PRODUCTION) {
    require('./dev')(app);
  }
};

module.exports = expressConfig;