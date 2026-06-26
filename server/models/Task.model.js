const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Open',
  },
  assignedTo: {
    type: DataTypes.STRING,
  },
  dueDate: {
    type: DataTypes.DATEONLY,
  },
  priority: {
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
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdOn: {
    type: DataTypes.DATEONLY,
  },
}, {
  tableName: 'tasks',
  timestamps: true,
  indexes: [
    { fields: ['linkedType', 'linkedId'] },
    { fields: ['assignedTo'] }
  ]
});

module.exports = Task;
