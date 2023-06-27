const Sequelize=require('sequelize');
const sequelize=require('../config/database');

const User = sequelize.define("forgotPasswordRequest", {
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  userid: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isactive: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = User;