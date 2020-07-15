require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./routes/user.router");
const taskRouter = require("./routes/task.router");
const groupRouter = require("./routes/group.router");

app.use(express.json());

const port = process.env.PORT || "3000";
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/groups", groupRouter);

module.exports = app;
