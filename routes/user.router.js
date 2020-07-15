const {
  createUser,
  login,
  refreshAccessToken,
} = require("../controllers/user.controller");
const router = require("express").Router();

router.post("/signup", createUser);
router.post("/login", login);
router.get("/token", refreshAccessToken);

module.exports = router;
