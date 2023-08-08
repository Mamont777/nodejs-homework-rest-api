const bcrypt = require("bcryptjs");
const { User } = require("../../models/user");
const { HttpError, sendEmail } = require("../../helpers");
const gravatar = require("gravatar");
const { nanoid } = require("nanoid");

const { BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const createHashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const verifyEmail = {
    to: email,
    subject: "Please verify your email",
    html: `<h1>Please verify your email</h1>
        <a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click here to verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  const newUser = await User.create({
    ...req.body,
    password: createHashPassword,
    avatarURL,
    verificationToken,
  });

  res.status(201).json({
    email: newUser.email,
    name: newUser.name,
    avatarURL: newUser.avatarURL,
  });
};

module.exports = register;
