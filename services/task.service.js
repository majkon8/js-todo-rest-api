const pool = require("../db/config");

module.exports = {
  createTask: (data, callBack) => {
    pool.query(
      `INSERT INTO task(user_id, body, created_at, group_id) values(?, ?, ?, ?)`,
      [data.userId, data.body, new Date(), data.group_id],
      (error, results) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  },
  getAllTasksForUser: (userId, callBack) => {
    pool.query(
      `SELECT id, body, created_at, group_id, done FROM task WHERE user_id = ?`,
      [userId],
      (error, results) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  },
  deleteTask: (data, callBack) => {
    pool.query(
      `DELETE FROM task WHERE id = ?`,
      [data.taskId, data.userId],
      (error, results) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  },
  getTask: (data, callBack) => {
    pool.query(
      `SELECT body, created_at, group_id, done FROM task WHERE id = ? AND user_id = ?`,
      [data.createdTaskId, data.userId],
      (error, results) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  },
  toggleTaskDone: (data, callBack) => {
    pool.query(
      `UPDATE task SET done = ? WHERE id = ? AND user_id = ?`,
      [data.done, data.taskId, data.userId],
      (error, results) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  },
};
