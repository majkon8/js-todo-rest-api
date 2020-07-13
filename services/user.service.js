const pool = require("../db/config");

module.exports = {
  createUser: (data, callBack) => {
    pool.query(
      `INSERT INTO user(password, email) values(?, ?)`,
      [data.password, data.email],
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
};
