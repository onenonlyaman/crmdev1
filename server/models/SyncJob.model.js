const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SyncJob = sequelize.define('SyncJob', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false, // 'google' or 'meta'
  },
  jobType: {
    type: DataTypes.STRING,
    allowNull: false, // 'campaigns', 'forms', 'leads'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'running', // 'success', 'failed', 'running'
  },
  recordsSynced: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'sync_jobs',
  timestamps: true,
});

module.exports = SyncJob;
