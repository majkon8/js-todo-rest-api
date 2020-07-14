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
      `SELECT body, created_at, group_id FROM task WHERE user_id = ?`,
      [userId],
      (error, results) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  },
  deleteTask: (taskId, callBack) => {
    pool.query(`DELETE FROM task WHERE id = ?`, [taskId], (error, results) => {
      if (error) return callBack(error);
      return callBack(null, results);
    });
  },
};
