const express = require("express");
const ctrl = require("../../controllers/contacts");
const { validateBody, isValidId, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/contact");
const { ctrlWrapper } = require("../../helpers");

const router = express.Router();

router.get("/", authenticate, ctrlWrapper(ctrl.getAllContacts));

router.get(
  "/:contactId",
  authenticate,
  isValidId,
  ctrlWrapper(ctrl.getContactById)
);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addSchema),
  ctrlWrapper(ctrl.addContact)
);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(schemas.addSchema),
  ctrlWrapper(ctrl.updateContactById)
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrlWrapper(ctrl.updateFavorite)
);

router.delete(
  "/:contactId",
  authenticate,
  isValidId,
  ctrlWrapper(ctrl.removeContact)
);

module.exports = router;
