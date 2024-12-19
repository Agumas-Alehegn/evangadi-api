const dbConnection = require("../db/dbConfig");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");

async function postQuestion(req, res) {
  const { question, question_description, tag } = req.body;
  if (!question || !question_description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: getReasonPhrase(StatusCodes.BAD_REQUEST) });
  }
  try {
    const access_token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;
    const question_id = uuid();

    const questionInsertQuery =
      "INSERT INTO  question (user_id, question_id, question, question_description,tag) VALUES(?,?,?,?,?) ";
    await dbConnection.query(questionInsertQuery, [
      user_id,
      question_id,
      question,
      question_description,
      tag || "general",
    ]);
    res.status(StatusCodes.CREATED).json({
      msg: "Question posted successfully",
      question_id,
      user_id,
    });
  } catch (error) {
    console.error("Error posting question", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to post question, please try again later",
    });
  }
}
async function getQuestions(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;
  try {
    const [questions] = await dbConnection.query(
      `SELECT 
  question.question_id, 
    question.question, 
    question.question_description, 
    question.tag, 
    question.questioned_at, 
    user_registration.user_name 
  FROM 
    question 
  JOIN 
    user_registration 
  ON 
    question.user_id = user_registration.user_id 
  ORDER BY 
    question.questioned_at DESC 
  LIMIT ? OFFSET ?;
  `,
      [limit, offset]
    );

    const [[{ total }]] = await dbConnection.query(
      "SELECT COUNT(*) as total FROM question"
    );
    const totalPages = Math.ceil(total / limit);

    res.status(StatusCodes.OK).json({
      msg: "Questions fetched successfully",
      questions,
      totalPages,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch questions, please try again later",
    });
  }
}
async function getSingleQuestions(req, res) {
  const { id } = req.params;
  try {
    const questionQuery = `SELECT 
  question.question_id, 
    question.question, 
    question.question_description, 
    question.tag, 
    question.questioned_at, 
    user_registration.user_name 
  FROM 
    question 
  JOIN 
    user_registration 
  ON 
    question.user_id = user_registration.user_id 
  ORDER BY 
    question.questioned_at DESC;
  `;
    const [questions] = await dbConnection.query(questionQuery);
    const question = questions.find((q) => q.question_id === id);
    res.status(StatusCodes.OK).json({
      msg: "Questions fetched successfully",
      question,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch questions, please try again later",
    });
  }
}
module.exports = { postQuestion, getQuestions, getSingleQuestions };
