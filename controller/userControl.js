const dbConnection = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const { StatusCodes, getReasonPhrase } = require("http-status-codes");
const jwt = require("jsonwebtoken");
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
async function login(req, res) {
  const { user_email, user_pass } = req.body;
  if (!user_email || !user_pass) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      msg: "Please enter your email and password to log in",
    });
  }
  try {
    const [user] = await dbConnection.query(
      "SELECT user_id, user_name, user_email, user_pass from user_registration WHERE user_email =?",
      [user_email]
    );
    if (user.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        msg: "Invalid credentials,  user email not found ",
      });
    }

    const isMatch = await bcrypt.compare(user_pass, user[0].user_pass);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        msg: "Invalid credentials, password does not match",
      });
    }

    const { user_id, user_name } = user[0];
    const token = jwt.sign({ user_id, user_name }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(StatusCodes.OK).json({
      msg: "Login successful",
      access_token: token,
      user_name,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "login failed, please try again later",
    });
  }
}

module.exports = { register, login };
