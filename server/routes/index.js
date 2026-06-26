/**
 * API Routes Index
 * Mounts all module routes.
 */
const express = require('express');
const router = express.Router();

// Import route modules
const crmRoutes = require('./crm.routes');
const authRoutes = require('./auth.routes');
const authenticateToken = require('../middleware/auth');

// Mount routes
router.use('/auth', authRoutes);
router.use('/crm', authenticateToken, crmRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CRM Standalone API is running' });
});

module.exports = router;
