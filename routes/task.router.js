const {
  createTask,
  getAllTasksForUser,
  deleteTask,
  toggleTaskDone,
  toggleTaskImportant,
} = require("../controllers/task.controller");
const { checkToken } = require("../middlewares/token_validation");

const router = require("express").Router();

router.post("/", checkToken, createTask);
router.get("/", checkToken, getAllTasksForUser);
router.delete("/", checkToken, deleteTask);
router.patch("/done", checkToken, toggleTaskDone);
router.patch("/important", checkToken, toggleTaskImportant);

module.exports = router;
