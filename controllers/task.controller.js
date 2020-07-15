const {
  createTask,
  getAllTasksForUser,
  deleteTask,
  getTask,
  toggleTaskDone,
} = require("../services/task.service");

module.exports = {
  createTask: (req, res) => {
    const data = req.body;
    const userId = req.decodedToken.user.id;
    data.userId = userId;
    createTask(data, (error, results) => {
      if (error) {
        console.error(error);
        return res.json({
          success: false,
          message: "Something went wrong",
        });
      }
      const resultsToSend = results;
      const createdTaskId = results.insertId;
      const data = { userId, createdTaskId };
      getTask(data, (error, results) => {
        if (error) {
          console.error(error);
          return res.json({
            success: false,
            message: "Something went wrong",
          });
        }
        return res.json({
          success: true,
          data: resultsToSend,
          message: "Task created successfully",
          createdTask: { id: createdTaskId, ...results[0] },
        });
      });
    });
  },
  getAllTasksForUser: (req, res) => {
    const userId = req.decodedToken.user.id;
    getAllTasksForUser(userId, (error, results) => {
      if (error) {
        console.error(error);
        return res.json({
          success: false,
          message: "Something went wrong",
        });
      }
      return res.json({ success: true, data: results });
    });
  },
  deleteTask: (req, res) => {
    const taskId = req.body.taskId;
    const userId = req.decodedToken.user.id;
    const data = { taskId, userId };
    deleteTask(data, (error, results) => {
      if (error) {
        console.error(error);
        return res.json({
          success: false,
          message: "Something went wrong",
        });
      }
      if (results.affectedRows === 0)
        return res.json({ success: false, message: "Task not found" });
      return res.json({
        success: true,
        message: "Task deleted successfully",
      });
    });
  },
  toggleTaskDone: (req, res) => {
    const data = req.body;
    const userId = req.decodedToken.user.id;
    data.userId = userId;
    toggleTaskDone(data, (error, results) => {
      if (error) {
        console.error(error);
        return res.json({
          success: false,
          message: "Something went wrong",
        });
      }
      if (results.affectedRows === 0)
        return res.json({ success: false, message: "Task not found" });
      return res.json({ success: true, message: "Task updated successfully" });
    });
  },
};
