const {
  createTask,
  getAllTasksForUser,
  deleteTask,
} = require("../controllers/task.controller");
const { checkToken } = require("../middlewares/token_validation");

const router = require("express").Router();

router.post("/", checkToken, createTask);
router.get("/", checkToken, getAllTasksForUser);
router.delete("/", checkToken, deleteTask);

module.exports = router;
