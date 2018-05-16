'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost/tipnem_faucet',
{ logging: console.log });

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};