const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  salutation: {
    type: DataTypes.STRING,
    defaultValue: 'Mr',
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  mobileNo: {
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.STRING,
  },
  organization: {
    type: DataTypes.STRING,
  },
  website: {
    type: DataTypes.STRING,
  },
  noOfEmployees: {
    type: DataTypes.STRING,
  },
  territory: {
    type: DataTypes.STRING,
  },
  annualRevenue: {
    type: DataTypes.STRING,
  },
  industry: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'New',
  },
  leadOwner: {
    type: DataTypes.STRING,
    defaultValue: 'Admin User',
  },
  leadSource: {
    type: DataTypes.STRING,
  },
  jobTitle: {
    type: DataTypes.STRING,
  },
  propertyType: {
    type: DataTypes.STRING,
  },
  budgetRange: {
    type: DataTypes.STRING,
  },
  preferredArea: {
    type: DataTypes.STRING,
  },
  followUpDate: {
    type: DataTypes.STRING,
  },
  priority: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  assignedTo: {
    type: DataTypes.STRING,
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'leads',
  timestamps: true,
});

module.exports = Lead;
