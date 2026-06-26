const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Contract = sequelize.define('Contract', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  partyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Draft',
  },
  fulfilmentStatus: {
    type: DataTypes.STRING,
  },
  documentName: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'contracts',
  timestamps: true,
});

module.exports = Contract;
