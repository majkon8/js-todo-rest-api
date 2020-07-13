const { createUser, getUserByEmail } = require("../services/user.service");
const { hashSync, compareSync } = require("bcrypt-nodejs");
const { sign } = require("jsonwebtoken");
const { validateNewUserData } = require("../validators/index");

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const errors = validateNewUserData(body);
    if (errors.length > 0)
      return res.status(500).json({ success: false, message: errors });
    body.password = hashSync(body.password);
    createUser(body, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message:
            error.code === "ER_DUP_ENTRY"
              ? "Email already registered"
              : "Datebase connection error",
        });
      }
      return res.status(200).json({
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
        return res
          .status(500)
          .json({ success: false, message: "Datebase connection error" });
      }
      if (!results)
        return res.status(500).json({
          success: false,
          message: "User with that email not found",
        });
      const passwordIsValid = compareSync(body.password, results.password);
      if (!passwordIsValid)
        return res
          .status(500)
          .json({ success: false, message: "Wrong password" });
      // Make password = null to not include the password in jsontoken
      results.password = null;
      const jsontoken = sign({ user: results }, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
      return res.status(200).json({ success: true, data: jsontoken });
    });
  },
};
