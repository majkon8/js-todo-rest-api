const pool = require("../db/config");

module.exports = {
  createGroup: (data, callBack) => {
    pool.query(
      `INSERT INTO tasks_group(user_id, name) values(?, ?)`,
      [data.userId, data.name],
      (error, results) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  },
  getAllGroupsForUser: (userId, callBack) => {
    pool.query(
      `SELECT id, name FROM tasks_group WHERE user_id = ?`,
      [userId],
      (error, results) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  },
  deleteGroup: (data, callBack) => {
    pool.query(
      `DELETE FROM tasks_group WHERE id = ? AND user_id = ?`,
      [data.groupId, data.userId],
      (error, results) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  },
  getGroup: (data, callBack) => {
    pool.query(
      `SELECT name FROM tasks_group WHERE id = ? AND user_id = ?`,
      [data.createdGroupId, data.userId],
      (error, results) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  },
};
