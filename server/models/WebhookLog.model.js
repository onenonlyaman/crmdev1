const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WebhookLog = sequelize.define('WebhookLog', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false, // 'google' or 'meta'
  },
  payload: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending', // 'processed', 'failed', 'pending'
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  retryCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'webhook_logs',
  timestamps: true,
});

module.exports = WebhookLog;
