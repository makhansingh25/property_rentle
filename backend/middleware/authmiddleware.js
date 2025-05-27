const jwt = require("jsonwebtoken");
const db = require("../db/index");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;


  const token = authHeader.split(" ")[1];
  const secretKey = process.env.JWT_SECRET_KEY;

  try {
    const decoded = jwt.verify(token, secretKey);

    const user = await db("users").where({ email: decoded.email }).first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
