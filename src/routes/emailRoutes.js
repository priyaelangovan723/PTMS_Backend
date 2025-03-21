const express = require("express");
const { sendEmails,sendVenueUpdateEmails } = require("../../src/controller/Email Controller/emailController");

const router = express.Router();

router.post("/send-registration-emails", sendEmails);
router.post("/venue-update-emails/:id",sendVenueUpdateEmails)

module.exports = router;
