const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OauthAccount = sequelize.define('OauthAccount', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false, // 'google' or 'meta'
  },
  accessToken: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  profileId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'oauth_accounts',
  timestamps: true,
});

module.exports = OauthAccount;
