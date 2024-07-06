const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const sendMail = async (req, res) => {
  const apiKey = process.env.SECRET;
  const { toAddress, name, base_url, user, ip, otp, key } = req.body;

  if (!toAddress || !name || !base_url || !user || !ip || !otp || !key)
    return res
      .status(500)
      .json({ status: false, message: "The required keys are not present" });

  const config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: user,
      link: base_url,
    },
  });

  const emailContent = {
    body: {
      name: name,
      intro: `You have successfully registered on ${user}.`,
      action: {
        instructions: "To verify your account, please click the button below:",
        button: {
          color: "#22BC66",
          text: "Verify Account",
          link: `${base_url}/verify/${otp}`,
        },
      },
      outro: `If you did not create an account, no further action is required. <br><br> Thank you! <br><br> ${user} Team <br><br><br><p style="font-size:11px;">Disclaimer: We received a request on ${user} website from IP: ${get_client_ip}</p>`,
    },
  };

  const emailBody = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  const msg = {
    from: process.env.EMAIL,
    to: toAddress,
    subject: `Verify Account on ${user}`,
    html: emailBody,
    text: emailText,
  };

  if (key === apiKey) {
    transporter
      .sendMail(msg)
      .then(() => {
        return res.status(200).json({ status: true, message: "Verification email sent" });
      })
      .catch((err) => {
        return res.status(500).json({ status: false, message: err.message });
      });
  } else {
    return res.status(404).json({ status: false, message: "Invalid apikey" });
  }
};

module.exports = {
  sendMail,
};
