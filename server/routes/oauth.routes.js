const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauth.controller');

// Google OAuth Login URL Redirect
router.get('/google/login', (req, res) => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const options = {
    redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/oauth/google/callback',
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/adwords'
    ].join(' ')
  };

  const qs = new URLSearchParams(options).toString();
  res.redirect(`${rootUrl}?${qs}`);
});

// Google OAuth Callback
router.get('/google/callback', oauthController.handleGoogleCallback);

// Meta/Facebook OAuth Login Redirect
router.get('/meta/login', (req, res) => {
  const rootUrl = 'https://www.facebook.com/v19.0/dialog/oauth';
  const options = {
    client_id: process.env.META_CLIENT_ID,
    redirect_uri: process.env.META_REDIRECT_URI || 'http://localhost:5000/api/oauth/meta/callback',
    scope: [
      'email',
      'pages_show_list',
      'ads_management',
      'pages_read_engagement',
      'pages_manage_ads',
      'leads_retrieval'
    ].join(',')
  };

  const qs = new URLSearchParams(options).toString();
  res.redirect(`${rootUrl}?${qs}`);
});

// Meta OAuth Callback
router.get('/meta/callback', oauthController.handleMetaCallback);

module.exports = router;
