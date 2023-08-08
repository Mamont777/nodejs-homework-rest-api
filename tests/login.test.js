/* 1. Res should have status 200
2. Return token
3. Return user { email: String, subscription: String}  */

const mongoose = require("mongoose");
const app = require("../app");
const { User } = require("../models/user");
const { DB_HOST, PORT } = process.env;
const { login } = require("../controllers/auth");
const bcrypt = require("bcryptjs");

jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

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

  test("should login user with fields mail and subscription", async () => {
    const myEmail = "test2@gmail.com";
    const myPassword = "123456";

    const mockUser = new User({
      email: myEmail,
      password: await bcrypt.hash(myPassword, 10),
    });

    jest.spyOn(User, "findOne").mockResolvedValue(mockUser);

    const req = {
      body: {
        email: myEmail,
        password: myPassword,
      },
    };

    const res = {
      json: jest.fn(),
    };

    await login(req, res);

    //     // Checkin expecting results

    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      code: 200,
      data: {
        token: expect.any(String),
      },
      user: {
        email: myEmail,
        subscription: mockUser.subscription,
      },
    });
    expect(User.findOne).toHaveBeenCalledWith({ email: myEmail });
  });
});
