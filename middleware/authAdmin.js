const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  //Authorization = bearer askjdhasd....
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Access token not found" });
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const role = decoded.role;
    if (role != "admin")
      return res
        .status(403)
        .json({
          success: false,
          message: "you do not have enough permissions",
        });
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ success: false, massage: "Invalid token" });
  }
};

module.exports = verifyToken;
