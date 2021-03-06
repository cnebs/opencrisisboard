const passport = require('passport');
const signIn = require('./controller').signIn;
const getFullProfile = require('./controller').getFullProfile;

/**
 * user apis
 */
const userAPI = (app) => {
  // get authenticated user
  app.get('/api/user/getUser', (req, res) => {
    if (req.user) res.send(req.user);
    else res.send(null);
  });

  // facebook authentication route
  app.get(
    '/api/user/authViaFacebook',
    passport.authenticate('facebook', {
      scope : ['user_link']
    })
  );

  // twitter authentication route
  app.get(
    '/api/user/authViaTwitter',
    passport.authenticate('twitter')
  );

  // github authentication route
  app.get(
    '/api/user/authViaGithub',
    passport.authenticate('github')
  );

  // callback route from facebook
  app.get(
    // this should match callback url of facebook app
    '/api/user/authViaFacebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/signIn/failed' }),
    (req, res) => { res.redirect('/'); }
  );

  // callback route from twitter
  app.get(
    // this should match callback url of twitter app
    '/api/user/authViaTwitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/signIn/failed' }),
    (req, res) => { res.redirect('/'); }
  );

  // callback route from github
  app.get(
    // this should match callback url of github app
    '/api/user/authViaGithub/callback',
    passport.authenticate('github', { failureRedirect: '/signIn/failed' }),
    (req, res) => { res.redirect('/'); }
  );

  // signout the user
  app.get('/api/user/signout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  // get user full profile
  app.get('/api/user/profile/:username', (req, res) => {
    getFullProfile(req.params.username).then(
      result => { res.send(result); },
      error => { res.send({ error }); }
    );
  });
};

module.exports = userAPI;
