const express = require("express");
const { authenticate } = require("../../middlewares");
const { ctrlWrapper } = require("../../helpers");
const ctrl = require('../../controllers/users')

const router = express.Router();

router.get("/current", authenticate, ctrlWrapper(ctrl.getCurrent));

module.exports = router;
