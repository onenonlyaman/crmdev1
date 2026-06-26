const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerGroup: {
    type: DataTypes.STRING,
    defaultValue: 'Individual',
  },
  territory: {
    type: DataTypes.STRING,
  },
  contactPerson: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  mobile: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.TEXT,
  },
  gstin: {
    type: DataTypes.STRING,
  },
  panNumber: {
    type: DataTypes.STRING,
  },
  assignedTo: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active',
  },
  totalDeals: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalValue: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
  },
  createdOn: {
    type: DataTypes.DATEONLY,
  },
}, {
  tableName: 'customers',
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['mobile'] },
    { fields: ['assignedTo'] }
  ]
});

module.exports = Customer;
