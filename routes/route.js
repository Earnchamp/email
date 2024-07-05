const router = require("express").Router();
const { sendMail } = require("../controllers/mail.js");

router.post("/send", sendMail);

module.exports = router;
