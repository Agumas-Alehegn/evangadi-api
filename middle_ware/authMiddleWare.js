const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
// middleware to verify
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      msg: "Authentication failed",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const { user_id, user_name } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { user_id, user_name };
    next();
  } catch (error) {
    return res.status(StatusCodes.FORBIDDEN).json({
      msg: "Token is not valid",
    });
  }
}

module.exports = verifyToken;
