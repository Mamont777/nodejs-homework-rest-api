const express = require("express");
const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user");
const { register } = require("../../controllers/auth/register");
const { login } = require("../../controllers/auth/login");
const { ctrlWrapper } = require("../../helpers");

const router = express.Router();

router.post(
  "/register",
  validateBody(schemas.registerSchema),
  ctrlWrapper(register)
);

router.post("/login", validateBody(schemas.loginSchema), ctrlWrapper(login));

module.exports = router;
