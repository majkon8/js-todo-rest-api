const { createUser, login } = require("../controllers/user.controller");
const router = require("express").Router();

router.post("/signup", createUser);
router.post("/login", login);

module.exports = router;
