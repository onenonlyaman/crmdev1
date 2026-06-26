const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Maintenance = sequelize.define('Maintenance', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer: {
    type: DataTypes.STRING,
  },
  maintenanceType: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Open',
  },
  priority: {
    type: DataTypes.STRING,
  },
  assignedTo: {
    type: DataTypes.STRING,
  },
  scheduledDate: {
    type: DataTypes.STRING,
  },
  completedDate: {
    type: DataTypes.STRING,
  },
  propertyUnit: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'maintenances',
  timestamps: true,
});

module.exports = Maintenance;
