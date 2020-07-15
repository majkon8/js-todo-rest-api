const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

chai.should();

chai.use(chaiHttp);

describe("Group routes", () => {
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
  describe("POST api/groups/", () => {
    it("It should create a new group", (done) => {
      const group = {
        name: "Test group",
      };
      chai
        .request(server)
        .post("/api/groups/")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(group)
        .end((error, response) => {
          insertedId = response.body.data.insertId;
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(4);
          response.body.should.have.property("success").eq(true);
          response.body.should.have.property("data").and.to.be.an("object");
          response.body.should.have
            .property("message")
            .eq("Group created successfully");
          response.body.should.have
            .property("createdGroup")
            .and.to.be.an("object");
          Object.keys(response.body.createdGroup).length.should.be.eq(2);
          done();
        });
    });
  });
  describe("GET api/groups/", () => {
    it("It should get user groups", (done) => {
      chai
        .request(server)
        .get("/api/groups/")
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
  describe("DELETE api/groups/", () => {
    it("It should delete previously added group", (done) => {
      const body = { groupId: insertedId };
      chai
        .request(server)
        .delete("/api/groups/")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(true);
          response.body.should.have
            .property("message")
            .eq("Group deleted successfully");
          done();
        });
    });
    it("It should give an error 'Group not found'", (done) => {
      const body = { groupId: 0 };
      chai
        .request(server)
        .delete("/api/groups/")
        .set("Authorization", `Bearer ${accessToken}`)
        .send(body)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(false);
          response.body.should.have.property("message").eq("Group not found");
          done();
        });
    });
    it("It should give an error 'Access denied - unauthorized user'", (done) => {
      chai
        .request(server)
        .get("/api/groups/")
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
        .get("/api/groups/")
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
