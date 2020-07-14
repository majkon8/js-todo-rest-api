const { verify } = require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (authHeader) {
      // authorization header is in form: Bearer <token>, so token starts at 8th character in a string, that's why token.slice[7]
      const token = authHeader.slice(7);
      verify(token, process.env.JWT_KEY, (error, decodedToken) => {
        if (error)
          return res.json({ success: false, message: "Invalid token" });
        req.decodedToken = decodedToken;
        next();
      });
    } else {
      return res.json({
        success: false,
        message: "Access denied - unauthorized user",
      });
    }
  },
};
