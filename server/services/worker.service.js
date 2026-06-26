const { OauthAccount, WebhookLog, Integration } = require('../models');
const cryptoService = require('./crypto.service');
const { importLead } = require('./leadImporter.service');

// Start background worker checks
const startBackgroundWorkers = (app) => {
  console.log('[WorkerService] Background tasks initialized.');

  // Run checks every 10 minutes
  setInterval(async () => {
    try {
      await refreshExpiringTokens();
      await retryFailedWebhooks(app.get('io'));
    } catch (error) {
      console.error('[WorkerService] Error running background tasks:', error);
    }
  }, 10 * 60 * 1000); // 10 minutes
};

// 1. Refresh Expiring Google OAuth Tokens
const refreshExpiringTokens = async () => {
  try {
    const bufferTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes buffer
    const expiringAccounts = await OauthAccount.findAll({
      where: {
        provider: 'google',
        expiresAt: {
          [OauthAccount.sequelize.Sequelize.Op.lt]: bufferTime
        }
      }
    });

    if (expiringAccounts.length === 0) return;

    console.log(`[WorkerService] Found ${expiringAccounts.length} Google accounts requiring token refresh.`);

    for (const account of expiringAccounts) {
      if (!account.refreshToken) {
        console.warn(`[WorkerService] Account ${account.email} has no refresh token. Skipping.`);
        continue;
      }

      const decryptedRefresh = cryptoService.decrypt(account.refreshToken);

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: decryptedRefresh,
          grant_type: 'refresh_token',
        }).toString()
      });

      const data = await response.json();

      if (data.error) {
        console.error(`[WorkerService] Failed to refresh token for ${account.email}:`, data);
        continue;
      }

      const expiresAt = new Date(Date.now() + data.expires_in * 1000);
      const encryptedAccess = cryptoService.encrypt(data.access_token);

      await account.update({
        accessToken: encryptedAccess,
        expiresAt
      });

      console.log(`[WorkerService] Successfully refreshed access token for ${account.email}.`);
    }
  } catch (error) {
    console.error('[WorkerService] Error refreshing tokens:', error);
  }
};

// 2. Retry Failed Webhooks
const retryFailedWebhooks = async (io) => {
  try {
    const failedLogs = await WebhookLog.findAll({
      where: {
        status: 'failed',
        retryCount: {
          [WebhookLog.sequelize.Sequelize.Op.lt]: 5
        }
      },
      limit: 10
    });

    if (failedLogs.length === 0) return;

    console.log(`[WorkerService] Retrying ${failedLogs.length} failed webhook events.`);

    for (const log of failedLogs) {
      // Calculate delay based on exponential backoff: 2^retryCount * 1 minute
      const delay = Math.pow(2, log.retryCount) * 60 * 1000;
      const lastAttempt = new Date(log.updatedAt).getTime();
      
      if (Date.now() - lastAttempt < delay) {
        continue; // Not yet time to retry
      }

      await log.update({ retryCount: log.retryCount + 1 });

      try {
        const payload = log.payload;
        if (log.provider === 'google') {
          // Re-run Google mapping and import
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

          if (!leadData.firstName) leadData.firstName = 'Google Ads Lead';

          await importLead({
            provider: 'google',
            campaignName: payload.campaign_id ? `Campaign ID: ${payload.campaign_id}` : 'Google Ads Campaign',
            formName: payload.form_id ? `Form ID: ${payload.form_id}` : 'Google Lead Form',
            leadData,
            io
          });
        } else {
          // Re-run Meta mapping and import
          const entry = payload.entry?.[0];
          const change = entry?.changes?.[0];
          if (change && change.field === 'leadgen') {
            const { leadgen_id, page_id, form_id } = change.value;
            const account = await OauthAccount.findOne({ where: { provider: 'meta' } });
            if (!account) throw new Error('No connected Meta OAuth account');

            const accessToken = cryptoService.decrypt(account.accessToken);

            const leadUrl = `https://graph.facebook.com/v19.0/${leadgen_id}?access_token=${accessToken}`;
            const leadRes = await fetch(leadUrl);
            const leadDetails = await leadRes.json();

            if (leadDetails.error) throw new Error(leadDetails.error.message);

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

            await importLead({
              provider: 'meta',
              campaignName: 'Meta Page',
              formName: 'Meta Lead Form',
              leadData,
              io
            });
          }
        }

        await log.update({ status: 'processed', errorMessage: null });
        console.log(`[WorkerService] Webhook event ${log.id} successfully processed on retry.`);
      } catch (error) {
        console.error(`[WorkerService] Retry attempt failed for event ${log.id}:`, error.message);
        await log.update({ status: 'failed', errorMessage: error.message });
      }
    }
  } catch (error) {
    console.error('[WorkerService] Error running webhook retry worker:', error);
  }
};

module.exports = {
  startBackgroundWorkers
};
