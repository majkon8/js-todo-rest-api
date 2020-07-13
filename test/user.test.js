const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");

chai.should();

chai.use(chaiHttp);

describe("User routes", () => {
  // ---------- SIGNUP ----------
  describe("POST api/users/signup", () => {
    it("It should create new user", (done) => {
      const user = {
        // Make unique email address to pass the test
        email: `test${new Date().getTime()}@test.com`,
        password: "Password.123",
        confirmPassword: "Password.123",
      };
      chai
        .request(server)
        .post("/api/users/signup")
        .send(user)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(3);
          response.body.should.have.property("success").eq(true);
          response.body.should.have.property("data").and.to.be.an("object");
          response.body.should.have
            .property("message")
            .eq("User created successfully");
          done();
        });
    });

    it("It should give an error 'Email already registered'", (done) => {
      const user = {
        // That user email is already in DB
        email: "test@test.com",
        password: "Password.123",
        confirmPassword: "Password.123",
      };
      chai
        .request(server)
        .post("/api/users/signup")
        .send(user)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(false);
          response.body.should.have
            .property("message")
            .eq("Email already registered");
          done();
        });
    });

    it("It should give an error 'Invalid email address'", (done) => {
      const user = {
        email: "test@test",
        password: "Password.123",
        confirmPassword: "Password.123",
      };
      chai
        .request(server)
        .post("/api/users/signup")
        .send(user)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(false);
          response.body.should.have
            .property("message")
            .eq("Invalid email adddress");
          done();
        });
    });

    it("It should give an error 'Password too weak'", (done) => {
      const user = {
        email: "test@test.com",
        password: "Password",
        confirmPassword: "Password.123",
      };
      chai
        .request(server)
        .post("/api/users/signup")
        .send(user)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(false);
          response.body.should.have.property("message").eq("Password too weak");
          done();
        });
    });

    it("It should give an error 'Passwords must match'", (done) => {
      const user = {
        email: "test@test.com",
        password: "Password.123",
        confirmPassword: "Password",
      };
      chai
        .request(server)
        .post("/api/users/signup")
        .send(user)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(false);
          response.body.should.have
            .property("message")
            .eq("Passwords must match");
          done();
        });
    });
  });
  // ---------- LOGIN ----------
  describe("POST api/users/login", () => {
    it("It should send back access token", (done) => {
      const user = {
        email: "test@test.com",
        password: "Password.123",
      };
      chai
        .request(server)
        .post("/api/users/login")
        .send(user)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(true);
          response.body.should.have.property("data").and.to.be.an("string");
          done();
        });
    });

    it("It should give an error 'User with that email not found'", (done) => {
      const user = {
        email: "test@test",
        password: "Password.123",
      };
      chai
        .request(server)
        .post("/api/users/login")
        .send(user)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(false);
          response.body.should.have
            .property("message")
            .eq("User with that email not found");
          done();
        });
    });

    it("It should give an error 'Wrong password'", (done) => {
      const user = {
        email: "test@test.com",
        password: "Password",
      };
      chai
        .request(server)
        .post("/api/users/login")
        .send(user)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(false);
          response.body.should.have.property("message").eq("Wrong password");
          done();
        });
    });
  });
});
