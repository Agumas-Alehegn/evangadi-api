const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function postAnswer(req, res) {
  const { answer_description } = req.body;
  const { question_id } = req.params;

  if (!answer_description || !question_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Answer and question_id are required." });
  }
  try {
    const access_token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    const user_id = decoded.user_id;
    const postAnswerQuery =
      "INSERT INTO answer (user_id, question_id, answer_description) VALUES (?,?,?)";
    await dbConnection.query(postAnswerQuery, [
      user_id,
      question_id,
      answer_description,
    ]);
    res.status(StatusCodes.CREATED).json({
      msg: "Answer posted successfully",
      question_id,
    });
  } catch (error) {
    console.error("Error posting answer", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to post answer, please try again later",
    });
  }
}
async function getAnswers(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = 2;
  const offset = (page - 1) * limit;
  const { id } = req.params;

  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Question ID is required." });
  }
  try {
    const queryAnswer = `SELECT answer.answer_id,answer.answer_description, answer.answered_at, user_registration.user_id AS answer_user_id, user_registration.user_name AS answer_user_name FROM answer JOIN user_registration ON answer.user_id = user_registration.user_id  WHERE question_id =?  ORDER BY answer.answered_at DESC LIMIT ? OFFSET ?;`;

    const [answers] = await dbConnection.query(queryAnswer, [
      id,
      limit,
      offset,
    ]);
    const queryCount = `SELECT COUNT(*) as total FROM answer WHERE question_id =? `;
    const [[{ total }]] = await dbConnection.query(queryCount, [id]);
    const totalPages = Math.ceil(total / limit);
    res.status(StatusCodes.OK).json({
      msg: "answers fetched successfully",
      answers,
      totalPages,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Failed to fetch answers, please try again later",
    });
  }
}
module.exports = { postAnswer, getAnswers };
