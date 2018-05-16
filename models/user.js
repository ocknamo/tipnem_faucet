'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const User = loader.database.define('users', {
  userId: {
    type: Sequelize.STRING(30), // javascriptでuserIdを扱うと末尾を丸めてしまうため文字列として扱う
    primaryKey: true,
    allowNull: false
  },
  userScreenName: {
    type: Sequelize.STRING(20),
    allowNull: false
  },
  lastRequest: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastText: {
    type: Sequelize.STRING,
    allowNull: false
  },
  faucetCount: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false,
  indexes: [
    {
      fields: ['userId']
    }
  ]
});

module.exports = User;