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
    await dbConnection.execute("SELECT 1");
    console.log(`Server is running on http://localhost:${port}`);
    app.listen(port);
    console.log(port);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
connect();
