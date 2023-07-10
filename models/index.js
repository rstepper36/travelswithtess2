require('dotenv').config();  // to load environment variables from .env file
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

let sequelize;
if (process.env.CLEARDB_DATABASE_URL) {
  // if running on Heroku with ClearDB
  const dbUrlParts = url.parse(process.env.CLEARDB_DATABASE_URL);
  const [username, password] = dbUrlParts.auth.split(':');
  
  sequelize = new Sequelize(dbUrlParts.pathname.substr(1), username, password, {
    host: dbUrlParts.hostname,
    dialect: 'mysql',
  });
} else {
  // if running locally
  sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  });
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
