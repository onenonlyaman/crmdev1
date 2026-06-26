const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
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
  mobile: {
    type: DataTypes.STRING,
  },
  jobTitle: {
    type: DataTypes.STRING,
  },
  company: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Active',
  },
  source: {
    type: DataTypes.STRING,
  },
  createdOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'contacts',
  timestamps: true,
});

module.exports = Contact;
