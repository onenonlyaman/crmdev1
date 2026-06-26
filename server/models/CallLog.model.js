const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CallLog = sequelize.define('CallLog', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  to: {
    type: DataTypes.STRING,
  },
  from: {
    type: DataTypes.STRING,
  },
  duration: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  outcome: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  recordingUrl: {
    type: DataTypes.STRING,
  },
  linkedTo: {
    type: DataTypes.STRING,
  },
  linkedId: {
    type: DataTypes.STRING,
  },
  linkedType: {
    type: DataTypes.STRING,
  },
  callType: {
    type: DataTypes.STRING,
    defaultValue: 'outbound',
  },
  createdBy: {
    type: DataTypes.STRING,
  },
  createdOn: {
    type: DataTypes.DATEONLY,
  },
}, {
  tableName: 'call_logs',
  timestamps: true,
  indexes: [
    { fields: ['linkedType', 'linkedId'] }
  ]
});

module.exports = CallLog;
