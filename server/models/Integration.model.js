const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Integration = sequelize.define('Integration', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false, // 'google' or 'meta'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active', // 'active' or 'inactive'
  },
  accountId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  accountName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  config: {
    type: DataTypes.JSON,
    defaultValue: {}, // Config options, e.g. connected pages, forms, campaigns
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'integrations',
  timestamps: true,
});

module.exports = Integration;
