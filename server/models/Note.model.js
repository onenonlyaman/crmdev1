const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
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
  createdBy: {
    type: DataTypes.STRING,
  },
  createdOn: {
    type: DataTypes.STRING,
  },
  updatedOn: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'notes',
  timestamps: true,
});

module.exports = Note;
