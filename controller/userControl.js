const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
async function register(req, res) {
  const { user_name, user_email, user_pass, first_name, last_name } = req.body;
  if (!user_name || !user_email || !user_pass || !first_name || !last_name) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: getReasonPhrase(StatusCodes.BAD_REQUEST) });
  }
  try {
    const [user] = await dbConnection.query(
      "SELECT user_name, user_id FROM user_registration WHERE user_name = ? or user_email=?",
      [user_name, user_email]
    );

    if (user.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "User already exists",
      });
    }
    if (user_pass.length < 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        msg: "Password must be at least 8 characters long",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_pass, salt);

    const result = await dbConnection.query(
      "INSERT INTO user_registration(user_name, user_email,user_pass) VALUES (?,?,?)",
      [user_name, user_email, hashedPassword]
    );

    const user_id = result[0].insertId;

    await dbConnection.query(
      "INSERT INTO user_profile(user_id,first_name,last_name) VALUES(?,?,?)",
      [user_id, first_name, last_name]
    );

    return res.status(StatusCodes.CREATED).json({
      msg: "User registered successfully",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "User registration failed, please try again later",
    });
  }
}

module.exports = { register };
