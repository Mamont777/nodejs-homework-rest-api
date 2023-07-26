const { User } = require("../../models/user");
const { HttpError } = require("../../helpers");

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const user = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );

  if (!user) {
    throw HttpError(404, "User not found");
  }

  res.json({ message: "Subscription updated successfully", user });
};

module.exports = updateSubscription;
