const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Opportunity = sequelize.define('Opportunity', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  opportunityFrom: {
    type: DataTypes.STRING,
  },
  party: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Open',
  },
  amount: {
    type: DataTypes.BIGINT,
  },
  propertyType: {
    type: DataTypes.STRING,
  },
  preferredArea: {
    type: DataTypes.STRING,
  },
  configuration: {
    type: DataTypes.STRING,
  },
  budgetRange: {
    type: DataTypes.STRING,
  },
  source: {
    type: DataTypes.STRING,
  },
  expectedCloseDate: {
    type: DataTypes.STRING,
  },
  assignedTo: {
    type: DataTypes.STRING,
  },
  priority: {
    type: DataTypes.STRING,
  },
  linkedLeadId: {
    type: DataTypes.STRING,
  },
  stage: {
    type: DataTypes.STRING,
    defaultValue: 'Qualification',
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'opportunities',
  timestamps: true,
});

module.exports = Opportunity;
