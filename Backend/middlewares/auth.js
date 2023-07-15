const jwt = require("jsonwebtoken");
const BlacklistModel = require("../blacklist");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const blacklist = await BlacklistModel.findOne();

    if (blacklist && blacklist.token.includes(token)) {
      return res.status(401).json({ message: "Login again" });
    }

    const decodedToken = jwt.verify(token, "abdul");
    req.userId = decodedToken.userId;
    req.username = decodedToken.username;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = auth;
