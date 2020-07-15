const pool = require("../db/config");

module.exports = {
  createUser: (data, callBack) => {
    pool.query(
      `INSERT INTO user(password, email, refresh_token) values(?, ?, ?)`,
      [data.password, data.email, data.refreshToken],
      (error, results) => {
        if (error) return callBack(error);
        return callBack(null, results);
      }
    );
  },
  getUserByEmail: (email, callBack) => {
    pool.query(
      `SELECT * FROM user WHERE email = ?`,
      [email],
      (error, results) => {
        if (error) return callBack(error);
        return callBack(null, results[0]);
      }
    );
  },
  findRefreshToken: (refreshToken, callBack) => {
    pool.query(
      `SELECT id, email FROM user WHERE refresh_token = ?`,
      [refreshToken],
      (error, results) => {
        if (error) return callBack(error);
        return callBack(null, results[0]);
      }
    );
  },
};
