const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const connectionString = process.env.DATABASE_URL;
let sequelize;

if (connectionString) {
  sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false
  });
} else {
  // Fallback to SQLite for local development when DATABASE_URL is not set
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: false
  });
}

const Game = require('./game')(sequelize, DataTypes);
const Developer = require('./developer')(sequelize, DataTypes);
const User = require('./user')(sequelize, DataTypes);

// Associations
Developer.hasMany(Game, { foreignKey: 'developerId' });
Game.belongsTo(Developer, { foreignKey: 'developerId' });

module.exports = {
  sequelize,
  Game,
  Developer,
  User
};
