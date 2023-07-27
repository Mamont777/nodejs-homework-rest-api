const express = require("express");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/auth");
const { ctrlWrapper } = require("../../helpers");

const router = express.Router();

// signup
router.post(
  "/register",
  validateBody(schemas.registerSchema),
  ctrlWrapper(ctrl.register)
);

// signin
router.post(
  "/login",
  validateBody(schemas.loginSchema),
  ctrlWrapper(ctrl.login)
);

// logout
router.post("/logout", authenticate, ctrlWrapper(ctrl.logout));

// Subscription
router.patch(
  "/users",
  authenticate,
  validateBody(schemas.updateSubscriptionSchems),
  ctrlWrapper(ctrl.updateSubscription)
);

module.exports = router;
