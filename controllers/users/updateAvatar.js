const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { User } = require("../../models/user");
const { HttpError } = require("../../helpers");

const avatarsPath = path.resolve("public", "avatars");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) {
    throw HttpError(400).json({ message: "No file uploaded" });
  }

  const { path: tempUpload, originalname } = req.file;

  const filename = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarsPath, filename);

  try {
    const image = await Jimp.read(tempUpload);
    await image.resize(250, 250).quality(60).write(resultUpload);
    await fs.unlink(tempUpload);
  } catch (error) {
    console.error("Error while resizing the image", error);
    throw HttpError(500).json({
      message: "Error while processing the image",
    });
  }
  //   await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL }, { new: true });

  res.json({
    avatarURL,
  });
};

module.exports = updateAvatar;
