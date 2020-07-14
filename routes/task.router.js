const {
  createTask,
  getAllTasksForUser,
  deleteTask,
} = require("../controllers/task.controller");

const router = require("express").Router();

router.post("/", createTask);
router.get("/:userId", getAllTasksForUser);
router.delete("/", deleteTask);

module.exports = router;
