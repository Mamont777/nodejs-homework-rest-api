const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (data) => {
  const msg = { ...data, from: "kardmitriy@gmail.com" };
  await sgMail.send(msg);
  return true;
};

module.exports = sendEmail;
