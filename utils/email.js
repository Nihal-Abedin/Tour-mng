const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //  create Transporter
  const tranporter = nodemailer.createTransport({
    // service:"Gmail",
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Activete in gmail "less secure app" option
  });

  // main Options
  const mailOptions = {
    from: "Natours <natours@natours.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // send email
  await tranporter.sendMail(mailOptions);
};
module.exports = sendEmail;
