const mysql2 = require("mysql2");
const dbConnection = mysql2.createPool({
  host: process.env.MYSQL_ADDON_HOST,
  database: process.env.MYSQL_ADDON_DB,
  user: process.env.MYSQL_ADDON_USER,
  password: process.env.MYSQL_ADDON_PASSWORD,
  port: process.env.MYSQL_ADDON_PORT,
  connectionLimit: 10,
});

module.exports = dbConnection.promise();
