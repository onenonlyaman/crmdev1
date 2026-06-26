const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  campaignName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  campaignType: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active',
  },
  startDate: {
    type: DataTypes.STRING,
  },
  endDate: {
    type: DataTypes.STRING,
  },
  budget: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  leads: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  description: {
    type: DataTypes.TEXT,
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'campaigns',
  timestamps: true,
});

module.exports = Campaign;
