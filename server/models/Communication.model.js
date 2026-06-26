const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Communication = sequelize.define('Communication', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
  },
  communicationMedium: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Open',
  },
  sentOrReceived: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'communications',
  timestamps: true,
});

module.exports = Communication;
