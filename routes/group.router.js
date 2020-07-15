const {
  createGroup,
  getAllGroupsForUser,
  deleteGroup,
} = require("../controllers/group.controller");
const { checkToken } = require("../middlewares/token_validation");

const router = require("express").Router();

router.post("/", checkToken, createGroup);
router.get("/", checkToken, getAllGroupsForUser);
router.delete("/", checkToken, deleteGroup);

module.exports = router;
