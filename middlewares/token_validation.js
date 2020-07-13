const { verify } = require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      // authorization header is in form: Bearer <token>, so token starts at 8th character in a string, that's why token.slice[7]
      token = token.slice[7];
      verify(token, process.env.JWT_KEY, (error, decodedToken) => {
        if (error)
          return res.json({ success: false, message: "Invalid token" });
        next();
      });
    }
    return res.json({
      success: false,
      message: "Access denied - unauthorized user",
    });
  },
};
