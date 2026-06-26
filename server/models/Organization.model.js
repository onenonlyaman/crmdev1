const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Organization = sequelize.define('Organization', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  website: {
    type: DataTypes.STRING,
  },
  industry: {
    type: DataTypes.STRING,
  },
  territory: {
    type: DataTypes.STRING,
  },
  noOfEmployees: {
    type: DataTypes.STRING,
  },
  annualRevenue: {
    type: DataTypes.BIGINT,
  },
  phone: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
  linkedContacts: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  linkedDeals: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'organizations',
  timestamps: true,
});

module.exports = Organization;
