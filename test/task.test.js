const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

chai.should();

chai.use(chaiHttp);

describe("Task routes", () => {
  let insertedId;
  describe("POST api/users/", () => {
    it("It should create new task", (done) => {
      const task = {
        // test@test.com user have id 23
        userId: 23,
        body: "Test task",
      };
      chai
        .request(server)
        .post("/api/tasks/")
        .send(task)
        .end((error, response) => {
          insertedId = response.body.data.insertId;
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(3);
          response.body.should.have.property("success").eq(true);
          response.body.should.have.property("data").and.to.be.an("object");
          response.body.should.have
            .property("message")
            .eq("Task created successfully");
          done();
        });
    });
  });
  describe("GET api/users/:id", () => {
    it("It should get user's tasks", (done) => {
      chai
        .request(server)
        // test@test.com user have id 23
        .get("/api/tasks/23")
        .send()
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(true);
          response.body.should.have.property("data").and.to.be.an("array");
          done();
        });
    });
  });
  describe("DELETE api/users/", () => {
    it("It should delete previously added task", (done) => {
      const body = { taskId: insertedId };
      chai
        .request(server)
        .delete("/api/tasks/")
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(true);
          response.body.should.have
            .property("message")
            .eq("Task deleted successfully");
          done();
        });
    });
    it("It should give an error 'Task not found'", (done) => {
      // taskId 3 don't exists in DB
      const body = { taskId: 0 };
      chai
        .request(server)
        .delete("/api/tasks/")
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(false);
          response.body.should.have.property("message").eq("Task not found");
          done();
        });
    });
  });
});
