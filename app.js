const express = require("express");
const app = express();
require("dotenv").config();
const port = 2323;
app.use(express.json());
const dbConnection = require("./db/dbConfig");
async function connect() {
  try {
    await dbConnection.execute("select 'test' ");
    console.log("Database connected successfully");
    app.listen(port);
    console.log("Server listening on http://localhost: " + port);
  } catch (error) {
    console.log(error.message);
  }
}
connect();
