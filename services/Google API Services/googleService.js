const { google } = require("googleapis");
const auth = new google.auth.GoogleAuth({
  keyFile: "authentication-377904-fe5355a83891.json",
  scopes: [
    "https://www.googleapis.com/auth/forms.body",
    "https://www.googleapis.com/auth/drive.file",
  ],
});
const forms = google.forms({ version: "v1", auth });
module.exports = { forms };


