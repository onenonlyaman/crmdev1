const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmailTemplate = sequelize.define('EmailTemplate', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
  },
  body: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING,
  },
  createdBy: {
    type: DataTypes.STRING,
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'email_templates',
  timestamps: true,
});

module.exports = EmailTemplate;
