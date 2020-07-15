const {
  createUser,
  getUserByEmail,
  findRefreshToken,
} = require("../services/user.service");
const { hashSync, compareSync } = require("bcrypt-nodejs");
const { sign } = require("jsonwebtoken");
const { validateNewUserData } = require("../validators/index");

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const errors = validateNewUserData(body);
    // send only first error
    if (errors.length > 0)
      return res.json({ success: false, message: errors[0] });
    body.password = hashSync(body.password);
    const user = { ...body };
    // Make password = null to not include the password in refresh token
    user.password = null;
    const refreshToken = sign({ user }, process.env.JWT_KEY);
    body.refreshToken = refreshToken;
    createUser(body, (error, results) => {
      if (error) {
        console.error(error);
        return res.json({
          success: false,
          message:
            error.code === "ER_DUP_ENTRY"
              ? "Email already registered"
              : "Something went wrong",
        });
      }
      return res.json({
        success: true,
        data: results,
        message: "User created successfully",
      });
    });
  },
  login: (req, res) => {
    const body = req.body;
    getUserByEmail(body.email, (error, results) => {
      if (error) {
        console.error(error);
        return res.json({
          success: false,
          message: "Something went wrong",
        });
      }
      if (!results)
        return res.json({
          success: false,
          message: "User with that email not found",
        });
      const passwordIsValid = compareSync(body.password, results.password);
      if (!passwordIsValid)
        return res.json({ success: false, message: "Wrong password" });
      // Make password = null to not include the password in access token
      results.password = null;
      const accessToken = sign({ user: results }, process.env.JWT_KEY, {
        expiresIn: "10m",
      });
      return res.json({
        success: true,
        data: { accessToken, refreshToken: results.refresh_token },
      });
    });
  },
  refreshAccessToken: (req, res) => {
    const refreshToken = req.get("Refresh");
    if (!refreshToken)
      return res.json({ success: false, message: "No refresh token provided" });
    findRefreshToken(refreshToken, (error, results) => {
      if (error) {
        console.error(error);
        return res.json({
          success: false,
          message: "Something went wrong",
        });
      }
      if (!results)
        return res.json({
          success: false,
          message: "Refresh token not found",
        });
      const accessToken = sign({ user: results }, process.env.JWT_KEY, {
        expiresIn: "10m",
      });
      return res.json({
        success: true,
        data: accessToken,
        message: "Access token refreshed",
      });
    });
  },
};
