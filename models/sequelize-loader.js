'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('tipnem_faucet', 'postgres', '', {
  dialect: 'postgres',
  logging: false,
  freezeTableName: true});

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};