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
          response.body.should.have.property("data").and.to.be.an("object");
          response.body.data.should.have
            .property("accessToken")
            .and.to.be.a("string");
          response.body.data.should.have
            .property("refreshToken")
            .and.to.be.a("string");
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
  describe("POST api/users/token", () => {
    it("It should send back refresh token", (done) => {
      // Correct refresh token of test user
      const refreshToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMywicGFzc3dvcmQiOm51bGwsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJlZnJlc2hfdG9rZW4iOiIifSwiaWF0IjoxNTk0Nzk3OTIyLCJleHAiOjE1OTQ4MDE1MjJ9.0tSe8Dd2S3PrKxxoxmgXJtr9s7oUZkBW4ot9LnvXLFE";
      chai
        .request(server)
        .get("/api/users/token")
        .send()
        .set("Refresh", refreshToken)
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(3);
          response.body.should.have.property("success").eq(true);
          response.body.should.have.property("data").and.to.be.an("string");
          response.body.should.have
            .property("message")
            .eq("Access token refreshed");
          done();
        });
    });
    it("It should give an error 'Refresh token not found'", (done) => {
      chai
        .request(server)
        .get("/api/users/token")
        .send()
        .set("Refresh", "token")
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(false);
          response.body.should.have
            .property("message")
            .eq("Refresh token not found");
          done();
        });
    });
    it("It should give an error 'No refresh token provided'", (done) => {
      chai
        .request(server)
        .get("/api/users/token")
        .send()
        .end((error, response) => {
          response.should.have.status(200);
          response.body.should.be.an("object");
          Object.keys(response.body).length.should.be.eq(2);
          response.body.should.have.property("success").eq(false);
          response.body.should.have
            .property("message")
            .eq("No refresh token provided");
          done();
        });
    });
  });
});
