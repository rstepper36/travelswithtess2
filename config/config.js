require('dotenv').config();
const url = require('url');

if (process.env.CLEARDB_DATABASE_URL) {
  // Heroku ClearDB configuration
  const dbUrlParts = url.parse(process.env.CLEARDB_DATABASE_URL);
  const [username, password] = dbUrlParts.auth.split(':');

  module.exports = {
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
  module.exports = {
    development: {
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      dialect: 'mysql',
    },
  };
}
