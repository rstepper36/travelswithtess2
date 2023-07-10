const Sequelize = require('sequelize');

module.exports = function() {
  return new Sequelize(process.env.CLEARDB_DATABASE_URL);
}
