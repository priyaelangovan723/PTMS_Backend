const { google } = require("googleapis");
const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GCP_SERVICE_ACCOUNT_KEY), // Load from environment variable
  scopes: [
    "https://www.googleapis.com/auth/forms.body",
    "https://www.googleapis.com/auth/drive.file",
  ],
});

const forms = google.forms({ version: "v1", auth });
module.exports = { forms };


