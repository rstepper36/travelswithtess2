require('dotenv').config();
const url = require('url');

let config;

if (process.env.CLEARDB_DATABASE_URL) {
  // Heroku ClearDB configuration
  const dbUrlParts = url.parse(process.env.CLEARDB_DATABASE_URL);
  const [username, password] = dbUrlParts.auth.split(':');

  config = {
    production: {
      username,
      password,
      database: dbUrlParts.pathname.substr(1),
      host: dbUrlParts.hostname,
      dialect: 'mysql',
    },
  };
} else {
  // local configuration
  config = {
    development: {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      dialect: 'mysql',
    },
  };
}

console.log(config); // log the configuration

module.exports = config;
