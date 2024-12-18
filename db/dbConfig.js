const mysql2 = require("mysql2");
const dbConnection = mysql2.createPool({
  user: process.env.USER,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  host: "localhost",
  connectionLimit: 10,
});

module.exports = dbConnection.promise();
