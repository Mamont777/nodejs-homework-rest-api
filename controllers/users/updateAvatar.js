const path = require("path");
const fs = require("fs/promises");
const { User } = require("../../models/user");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  const { path: tempUpload, originalName } = req.file;
  console.log(req.file);

  const resultUpload = path.join(avatarsDir, originalName);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", originalName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = updateAvatar;
