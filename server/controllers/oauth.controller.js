const { OauthAccount, Integration, sequelize } = require('../models');
const cryptoService = require('../services/crypto.service');

// Exchange auth code for Google Tokens
const handleGoogleCallback = async (req, res) => {
  const { code, state } = req.query;
  
  if (!code) {
    return res.redirect('/crm/settings?error=google_auth_failed');
  }

  try {
    const tokenUrl = 'https://oauth2.googleapis.com/token';
    const params = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/oauth/google/callback',
      grant_type: 'authorization_code',
    };

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params).toString(),
    });

    const data = await response.json();
    if (data.error) {
      console.error('Google token exchange error:', data);
      return res.redirect(`/crm/settings?error=${data.error_description || 'google_token_error'}`);
    }

    const { access_token, refresh_token, expires_in } = data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    // Get user details
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const userInfo = await userRes.json();

    const encryptedAccess = cryptoService.encrypt(access_token);
    const encryptedRefresh = refresh_token ? cryptoService.encrypt(refresh_token) : null;

    // Check if account already exists
    let account = await OauthAccount.findOne({ where: { provider: 'google', email: userInfo.email } });
    const nextId = async () => {
      const count = await OauthAccount.count();
      return `ACC-${String(count + 1).padStart(4, '0')}`;
    };

    if (account) {
      await account.update({
        accessToken: encryptedAccess,
        expiresAt,
        ...(encryptedRefresh && { refreshToken: encryptedRefresh }),
      });
    } else {
      const id = await nextId();
      account = await OauthAccount.create({
        id,
        provider: 'google',
        accessToken: encryptedAccess,
        refreshToken: encryptedRefresh,
        expiresAt,
        profileId: userInfo.id,
        email: userInfo.email,
      });
    }

    // Initialize Integration
    const integrationId = `INT-${String(await Integration.count() + 1).padStart(4, '0')}`;
    await Integration.findOrCreate({
      where: { provider: 'google', accountId: userInfo.id },
      defaults: {
        id: integrationId,
        provider: 'google',
        status: 'active',
        accountId: userInfo.id,
        accountName: userInfo.email,
        config: { campaigns: [], forms: [] },
      },
    });

    res.redirect('/crm/settings?google_connected=true');
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect('/crm/settings?error=internal_google_error');
  }
};

// Exchange auth code for Meta/Facebook Tokens
const handleMetaCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.redirect('/crm/settings?error=meta_auth_failed');
  }

  try {
    const clientId = process.env.META_CLIENT_ID;
    const clientSecret = process.env.META_CLIENT_SECRET;
    const redirectUri = process.env.META_REDIRECT_URI || 'http://localhost:5000/api/oauth/meta/callback';

    // Get short-lived token
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&code=${code}`;
    const tokenRes = await fetch(tokenUrl);
    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      console.error('Meta token exchange error:', tokenData.error);
      return res.redirect(`/crm/settings?error=${tokenData.error.message || 'meta_token_error'}`);
    }

    const shortToken = tokenData.access_token;

    // Exchange for long-lived access token
    const longTokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${shortToken}`;
    const longTokenRes = await fetch(longTokenUrl);
    const longTokenData = await longTokenRes.json();

    const accessToken = longTokenData.access_token;
    const expiresAt = longTokenData.expires_in ? new Date(Date.now() + longTokenData.expires_in * 1000) : null;

    // Get user details
    const meRes = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
    const meData = await meRes.json();

    const encryptedAccess = cryptoService.encrypt(accessToken);

    let account = await OauthAccount.findOne({ where: { provider: 'meta', profileId: meData.id } });
    if (account) {
      await account.update({
        accessToken: encryptedAccess,
        expiresAt,
      });
    } else {
      const id = `ACC-${String(await OauthAccount.count() + 1).padStart(4, '0')}`;
      account = await OauthAccount.create({
        id,
        provider: 'meta',
        accessToken: encryptedAccess,
        expiresAt,
        profileId: meData.id,
        email: meData.email || `${meData.name.replace(/\s+/g, '').toLowerCase()}@facebook.com`,
      });
    }

    // Initialize Integration
    const integrationId = `INT-${String(await Integration.count() + 1).padStart(4, '0')}`;
    await Integration.findOrCreate({
      where: { provider: 'meta', accountId: meData.id },
      defaults: {
        id: integrationId,
        provider: 'meta',
        status: 'active',
        accountId: meData.id,
        accountName: meData.name,
        config: { pages: [], forms: [] },
      },
    });

    res.redirect('/crm/settings?meta_connected=true');
  } catch (error) {
    console.error('Meta callback error:', error);
    res.redirect('/crm/settings?error=internal_meta_error');
  }
};

module.exports = {
  handleGoogleCallback,
  handleMetaCallback,
};
