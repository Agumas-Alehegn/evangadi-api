const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = 2323;
app.use(cors());
app.use(express.json());
const dbConnection = require("./db/dbConfig");
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
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
