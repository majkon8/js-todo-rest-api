const {
  createTask,
  getAllTasksForUser,
  deleteTask,
  toggleTaskDone,
} = require("../controllers/task.controller");
const { checkToken } = require("../middlewares/token_validation");

const router = require("express").Router();

router.post("/", checkToken, createTask);
router.get("/", checkToken, getAllTasksForUser);
router.delete("/", checkToken, deleteTask);
router.patch("/", checkToken, toggleTaskDone);

module.exports = router;
