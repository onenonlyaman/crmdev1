const express = require('express');
const router = express.Router();
const { WebhookLog, OauthAccount, Integration } = require('../models');
const { importLead } = require('../services/leadImporter.service');
const cryptoService = require('../services/crypto.service');

// Google Webhook
router.post('/google', async (req, res) => {
  const io = req.app.get('io');
  let logEntry = null;

  try {
    // 1. Validate Secret Google Ads Webhook Key
    const webhookKey = req.headers['google-ads-key'] || req.query.key;
    if (process.env.GOOGLE_WEBHOOK_KEY && webhookKey !== process.env.GOOGLE_WEBHOOK_KEY) {
      console.warn('[Webhook Google] Unauthorized webhook attempt - invalid key');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = req.body;
    
    // Save raw log
    const logId = `WLOG-${String(await WebhookLog.count() + 1).padStart(4, '0')}`;
    logEntry = await WebhookLog.create({
      id: logId,
      provider: 'google',
      payload,
      status: 'pending'
    });

    // 2. Map Google Fields
    const leadData = {};
    if (payload.user_column_data && Array.isArray(payload.user_column_data)) {
      payload.user_column_data.forEach(item => {
        const name = item.column_name.toUpperCase();
        const value = item.string_value;
        if (name === 'FIRST_NAME') leadData.firstName = value;
        if (name === 'LAST_NAME') leadData.lastName = value;
        if (name === 'EMAIL') leadData.email = value;
        if (name === 'PHONE_NUMBER') leadData.mobileNo = value;
      });
    }

    // Default name if missing
    if (!leadData.firstName) leadData.firstName = 'Google Ads Lead';

    // 3. Import Lead via service
    await importLead({
      provider: 'google',
      campaignName: payload.campaign_id ? `Campaign ID: ${payload.campaign_id}` : 'Google Ads Campaign',
      formName: payload.form_id ? `Form ID: ${payload.form_id}` : 'Google Lead Form',
      leadData,
      io
    });

    await logEntry.update({ status: 'processed' });
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('[Webhook Google] Error processing webhook:', error);
    if (logEntry) {
      await logEntry.update({ status: 'failed', errorMessage: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Meta Webhook Verification (hub challenge)
router.get('/meta', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const expectedToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'meta_webhook_challenge_verify';

  if (mode === 'subscribe' && token === expectedToken) {
    console.log('[Webhook Meta] Verification successful');
    return res.status(200).send(challenge);
  }

  console.warn('[Webhook Meta] Verification failed');
  res.status(403).send('Forbidden');
});

// Meta Webhook Payload Receipt
router.post('/meta', async (req, res) => {
  const io = req.app.get('io');
  let logEntry = null;

  try {
    const payload = req.body;
    
    // Save raw log
    const logId = `WLOG-${String(await WebhookLog.count() + 1).padStart(4, '0')}`;
    logEntry = await WebhookLog.create({
      id: logId,
      provider: 'meta',
      payload,
      status: 'pending'
    });

    // Extract leadgen ID and page ID from entry changes
    const entry = payload.entry?.[0];
    const change = entry?.changes?.[0];
    
    if (!change || change.field !== 'leadgen') {
      await logEntry.update({ status: 'processed', errorMessage: 'Ignored non-leadgen change event' });
      return res.status(200).json({ status: 'ignored' });
    }

    const { leadgen_id, page_id, form_id } = change.value;

    // Fetch account access token for this page/integration
    const account = await OauthAccount.findOne({ where: { provider: 'meta' } });
    if (!account) {
      throw new Error('No connected Meta Ads OAuth account found to retrieve details.');
    }

    const accessToken = cryptoService.decrypt(account.accessToken);

    // Call Facebook Graph API to fetch lead details
    const leadUrl = `https://graph.facebook.com/v19.0/${leadgen_id}?access_token=${accessToken}`;
    const leadRes = await fetch(leadUrl);
    const leadDetails = await leadRes.json();

    if (leadDetails.error) {
      throw new Error(`Graph API Lead Retrieval Error: ${leadDetails.error.message}`);
    }

    // Map Meta field data
    const leadData = {};
    if (leadDetails.field_data && Array.isArray(leadDetails.field_data)) {
      leadDetails.field_data.forEach(field => {
        const name = field.name.toLowerCase();
        const value = field.values?.[0];
        
        if (name.includes('first_name')) leadData.firstName = value;
        else if (name.includes('last_name')) leadData.lastName = value;
        else if (name.includes('full_name') && !leadData.firstName) {
          const parts = value.split(' ');
          leadData.firstName = parts[0];
          leadData.lastName = parts.slice(1).join(' ');
        }
        else if (name.includes('email')) leadData.email = value;
        else if (name.includes('phone')) leadData.mobileNo = value;
      });
    }

    if (!leadData.firstName) leadData.firstName = 'Meta Ads Lead';

    // Get page and form name if cached in integration configuration
    const integration = await Integration.findOne({ where: { provider: 'meta' } });
    let pageName = 'Meta Page';
    let formName = 'Meta Lead Form';

    if (integration && integration.config) {
      const pageInfo = integration.config.pages?.find(p => p.id === page_id);
      if (pageInfo) pageName = pageInfo.name;
    }

    // Import Lead
    await importLead({
      provider: 'meta',
      campaignName: pageName,
      formName: formName,
      leadData,
      io
    });

    await logEntry.update({ status: 'processed' });
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('[Webhook Meta] Error processing webhook:', error);
    if (logEntry) {
      await logEntry.update({ status: 'failed', errorMessage: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
