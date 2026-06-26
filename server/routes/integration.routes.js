const express = require('express');
const router = express.Router();
const { Integration, OauthAccount, SyncJob } = require('../models');
const cryptoService = require('../services/crypto.service');
const authenticateToken = require('../middleware/auth');

// GET /api/integrations: List all active integrations
router.get('/', authenticateToken, async (req, res) => {
  try {
    const list = await Integration.findAll();
    const accounts = await OauthAccount.findAll({
      attributes: ['id', 'provider', 'email', 'expiresAt', 'createdAt']
    });

    res.json({
      integrations: list,
      oauthAccounts: accounts
    });
  } catch (error) {
    console.error('Fetch integrations error:', error);
    res.status(500).json({ error: 'Failed to retrieve integrations' });
  }
});

// DELETE /api/integrations/:id: Disconnect/Delete Integration
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const integration = await Integration.findByPk(req.params.id);
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    const provider = integration.provider;
    const accountId = integration.accountId;

    await integration.destroy();

    // Clean up corresponding oauth accounts of this provider
    await OauthAccount.destroy({
      where: { provider, profileId: accountId }
    });

    res.json({ message: 'Integration disconnected successfully' });
  } catch (error) {
    console.error('Delete integration error:', error);
    res.status(500).json({ error: 'Failed to disconnect integration' });
  }
});

// POST /api/integrations/sync: Manually trigger sync job
router.post('/sync', authenticateToken, async (req, res) => {
  const { provider } = req.body;

  if (!provider || !['google', 'meta'].includes(provider)) {
    return res.status(400).json({ error: 'Valid provider is required' });
  }

  try {
    // 1. Create a running SyncJob log
    const jobId = `JOB-${String(await SyncJob.count() + 1).padStart(4, '0')}`;
    const job = await SyncJob.create({
      id: jobId,
      provider,
      jobType: 'campaigns_forms',
      status: 'running'
    });

    // 2. Perform Mock Sync Actions
    // In production, query the Facebook Graph API or Google Ads API to sync lists of forms.
    // For now, we mock fetching data and saving it in the integration config.
    const integration = await Integration.findOne({ where: { provider } });
    if (!integration) {
      await job.update({ status: 'failed', errorMessage: 'No connected integration found', completedAt: new Date() });
      return res.status(400).json({ error: 'Integration must be connected first' });
    }

    let recordsSynced = 0;
    if (provider === 'meta') {
      const config = integration.config || {};
      config.pages = config.pages || [
        { id: '1098239081293', name: 'Real Estate Listings Page' },
        { id: '9081239023812', name: 'Luxury Villas Page' }
      ];
      config.forms = config.forms || [
        { id: 'F-8829', name: 'Meta Dream Home Form', pageId: '1098239081293' },
        { id: 'F-9901', name: 'Villas Contact Form', pageId: '9081239023812' }
      ];
      await integration.update({ config });
      recordsSynced = config.forms.length;
    } else {
      const config = integration.config || {};
      config.campaigns = config.campaigns || [
        { id: 'C-7701', name: 'Google Display Network Campaign' },
        { id: 'C-8802', name: 'Search Leads Campaign' }
      ];
      config.forms = config.forms || [
        { id: 'GF-112', name: 'Google Ads Contact Form', campaignId: 'C-8802' }
      ];
      await integration.update({ config });
      recordsSynced = config.forms.length;
    }

    await job.update({
      status: 'success',
      recordsSynced,
      completedAt: new Date()
    });

    res.json({ message: 'Sync completed successfully', job });
  } catch (error) {
    console.error('Manual sync error:', error);
    res.status(500).json({ error: 'Sync failed' });
  }
});

module.exports = router;
