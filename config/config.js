require('dotenv').config();
const url = require('url');

let config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
};

if (process.env.CLEARDB_DATABASE_URL) {
  // Heroku ClearDB configuration
  const dbUrlParts = url.parse(process.env.CLEARDB_DATABASE_URL);
  const [username, password] = dbUrlParts.auth.split(':');

  config.production = {
    username,
    password,
    database: dbUrlParts.pathname.substr(1),
    host: dbUrlParts.hostname,
    dialect: 'mysql',
  };
}

console.log(config); // log the configuration

module.exports = config;
