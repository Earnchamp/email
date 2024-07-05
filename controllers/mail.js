const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const sendMail = async (req, res) => {
  const apiKey = process.env.SECRET;
  const { toAddress, code, price, key } = req.body;

  if (!toAddress || !code || !price || !key)
    return res
      .status(500)
      .json({ status: false, message: "the required keys are not present" });

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
      name: "FlypCoin",
      link: "https://example.com",
    },
  });

  const emailContent = {
    body: {
      name: "User",
      intro: "Your order has been processed successfully.",
      table: {
        data: [
          {
            item: "Amazon Gift Card",
            code: code,
            price: "₹" + price,
          },
        ],
        columns: {
          // Optionally, customize the column widths
          customWidth: {
            item: "20%",
            price: "15%",
          },
          // Optionally, change column text alignment
          customAlignment: {
            price: "right",
          },
        },
      },
      action: {
        instructions:
          "You can redeem the Gift Card by clicking the button below",
        button: {
          color: "#3869D4",
          text: "Redeem Now",
          link: "https://www.amazon.com/",
        },
      },
      outro: "We thank you for your purchase.",
    },
  };

  const emailBody = mailGenerator.generate(emailContent);
  const emailText = mailGenerator.generatePlaintext(emailContent);

  const msg = {
    from: process.env.EMAIL,
    to: toAddress,
    subject: "Your Reward",
    html: emailBody,
    text: emailText,
  };

  if (key === apiKey) {
    transporter
      .sendMail(msg)
      .then(() => {
        return res.status(200).json({ status: true, message: "email sent" });
      })
      .catch((err) => {
        return res.status(500).json({ status: false, message: err });
      });
  } else {
    return res.status(404).json({ status: false, message: "Invalid apikey" });
  }
};

module.exports = {
  sendMail,
};
