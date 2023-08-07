/* 1. Res should have status 200
2. Return token
3. Return user { email: String, subscription: String}  */

const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const { User } = require("../models/user");
const { DB_HOST, PORT } = process.env;

describe("Login Controller", () => {
  let server = null;
  /* Connecting to the database before all tests. */
  beforeAll(async () => {
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    await mongoose.connect(DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  /* Closing database connection after all tests. */
  afterAll(async () => {
    server.close();
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("should register user", async () => {
    const registerData = {
      name: "test",
      email: "test@gmail.com",
      password: "123456",
    };

    const { statusCode, body } = await request(app)
      .post("/api/auth/register")
      .send(registerData);

    expect(statusCode).toBe(201);
    expect(body.user.name).toBe(registerData.name);
    expect(body.user.email).toBe(registerData.email);

    const user = await User.findOne({ email: registerData.email });
    expect(user.email).toBe(registerData.email);
  });

  test("should login user and return a token", async () => {
    // Creating user  testing
    const user = await User.create({
      name: "test",
      email: "test@gmail.com",
      password: "123456",
      subscription: "starter",
      avatarURL: "test_avatar_url",
    });

    const result = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@gmail.com", password: "123456" });

    //     // Checkin expecting results

    expect(result.statusCode).toBe(200);
    expect(result.body).toHaveProperty("token");
    expect(result.body.user).toBeDefined();
    expect(result.body.user).toHaveProperty("email", user.email);
    expect(result.body.user).toHaveProperty("subscription", user.subscription);

    expect(typeof result.body.user).toBe("object");
    expect(typeof result.body.user.email).toBe("string");
    expect(typeof result.body.user.subscription).toBe("string");
  });
});
