const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

chai.should();

chai.use(chaiHttp);

describe("Task routes", () => {
  let insertedId;
  let accessToken;
  before((done) => {
    // login user to get access token
    const user = {
      email: "test@test.com",
      password: "Password.123",
    };
    chai
      .request(server)
      .post("/api/users/login")
      .send(user)
      .end((error, response) => {
        accessToken = response.body.data.accessToken;
        done();
      });
  });
  describe("POST api/tasks/", () => {
    it("It should create new task", (done) => {
      const task = {
        body: "Test task",
      };
      chai
        .request(server)
        .post("/api/tasks/")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(task)
        .end((error, response) => {
          insertedId = response.body.data.insertId;
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(4);
          response.body.should.have.property("success").eq(true);
          response.body.should.have.property("data").and.to.be.an("object");
          response.body.should.have
            .property("message")
            .eq("Task created successfully");
          response.body.should.have
            .property("createdTask")
            .and.to.be.an("object");
          Object.keys(response.body.createdTask).length.should.be.eq(6);
          done();
        });
    });
  });
  describe("GET api/tasks/", () => {
    it("It should get user's tasks", (done) => {
      chai
        .request(server)
        .get("/api/tasks/")
        .set("Authorization", `Bearer ${accessToken}`)
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
  describe("PATCH api/tasks/done", () => {
    it("It should update done field in previously added task", (done) => {
      const body = { taskId: insertedId, done: true };
      chai
        .request(server)
        .patch("/api/tasks/done")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(true);
          response.body.should.have
            .property("message")
            .eq("Task updated successfully");
          done();
        });
    });
    it("It should give an error 'Task not found'", (done) => {
      const body = { taskId: 0, done: true };
      chai
        .request(server)
        .patch("/api/tasks/done")
        .set("Authorization", `Bearer ${accessToken}`)
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
  describe("PATCH api/tasks/important", () => {
    it("It should update important field in previously added task", (done) => {
      const body = { taskId: insertedId, important: true };
      chai
        .request(server)
        .patch("/api/tasks/important")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(true);
          response.body.should.have
            .property("message")
            .eq("Task updated successfully");
          done();
        });
    });
    it("It should give an error 'Task not found'", (done) => {
      const body = { taskId: 0, done: true };
      chai
        .request(server)
        .patch("/api/tasks/important")
        .set("Authorization", `Bearer ${accessToken}`)
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
  describe("DELETE api/tasks/", () => {
    it("It should delete previously added task", (done) => {
      const body = { taskId: insertedId };
      chai
        .request(server)
        .delete("/api/tasks/")
        .set("Authorization", `Bearer ${accessToken}`)
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
        .set("Authorization", `Bearer ${accessToken}`)
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
    it("It should give an error 'Access denied - unauthorized user'", (done) => {
      chai
        .request(server)
        .get("/api/tasks/")
        .send()
        .end((error, response) => {
          console.log(response.body);
          response.should.have.status(401);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(false);
          response.body.should.have
            .property("message")
            .eq("Access denied - unauthorized user");
          done();
        });
    });
    it("It should give an error 'Invalid token'", (done) => {
      chai
        .request(server)
        .get("/api/tasks/")
        .send()
        .set("Authorization", `Bearer token`)
        .end((error, response) => {
          response.should.have.status(401);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(false);
          response.body.should.have.property("message").eq("Invalid token");
          done();
        });
    });
  });
});
