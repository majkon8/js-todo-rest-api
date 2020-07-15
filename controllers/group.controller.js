const {
  createGroup,
  getAllGroupsForUser,
  deleteGroup,
  getGroup,
} = require("../services/group.service");

module.exports = {
  createGroup: (req, res) => {
    const data = req.body;
    const userId = req.decodedToken.user.id;
    data.userId = userId;
    createGroup(data, (error, results) => {
      if (error) {
        console.error(error);
        return res.json({
          success: false,
          message: "Something went wrong",
        });
      }
      const resultsToSend = results;
      const createdGroupId = results.insertId;
      const data = { userId, createdGroupId };
      getGroup(data, (error, results) => {
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
          message: "Group created successfully",
          createdGroup: { id: createdGroupId, ...results[0] },
        });
      });
    });
  },
  getAllGroupsForUser: (req, res) => {
    const userId = req.decodedToken.user.id;
    getAllGroupsForUser(userId, (error, results) => {
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
  deleteGroup: (req, res) => {
    const groupId = req.body.groupId;
    const userId = req.decodedToken.user.id;
    const data = { groupId, userId };
    deleteGroup(data, (error, results) => {
      if (error) {
        console.error(error);
        return res.json({
          success: false,
          message: "Something went wrong",
        });
      }
      if (results.affectedRows === 0)
        return res.json({ success: false, message: "Group not found" });
      return res.json({
        success: true,
        message: "Group deleted successfully",
      });
    });
  },
};
