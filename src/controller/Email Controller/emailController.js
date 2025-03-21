const nodemailer = require("nodemailer");
const { createForm } = require("../Form Controller/formController");
const Training = require('../../../models/Training');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.MAIL_USER
        , pass: process.env.MAIL_PASS },
  });

exports.sendEmails = async (req, res) => {
  try {
    
    const { emails, trainingDetails } = req.body;
    console.log(trainingDetails.Title)

    // Step 1: Call createForm from formController
    const { formUrl,formId, formEntry } = await createForm(trainingDetails);

    // Step 2: Construct Email Content
    let emailBody = trainingDetails.Resource === "OutsideBIT"
      ? `
        <p>Dear Students,</p>
        <p>Greetings of the day !!!</p>
        <p>Vendors for the <b>${trainingDetails.Title}</b> have been finalized based on students' feedback.</p>
        <p>Training Date: <b>${trainingDetails.StartDate} to ${trainingDetails.EndDate}</b></p>
       
        <p>Register here Google Form: <a href="${formUrl}" style="color:blue;">${formUrl}</a></p>
      `
      : `
        <p>Dear Students,</p>
        <p>Greetings from Training and Placement !!</p>
        <p>Internal Training starts from <b>${trainingDetails.StartDate}</b>.</p>
        <p>Register using the link below:</p>
        <p>Google Form: <a href="${formUrl}" style="color:blue;">${formUrl}</a></p>
      `;
    console.log(trainingDetails.Title)
    // Step 3: Send Emails
    await Promise.all(
      emails.map(email =>
        transporter.sendMail({
          from: process.env.MAIL_USER,
          to: email,
          subject: `Register for ${trainingDetails.Title}`,
          html: emailBody,
        })
      )
      
    );


    res.json({ message: "Form created and emails sent successfully", formUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};



exports.sendVenueUpdateEmails = async (req, res) => {
  try {
    const { venueDetails, emails } = req.body;
    const trainingId = req.params.id;
    console.log(trainingId)

    // Step 1: Update venue in the database
    const updateResult = await Training.updateVenueDetails(trainingId, venueDetails);
    if (!updateResult) {
      return res.status(404).json({ error: "Training not found or venue not updated" });
    }

    // Step 2: Fetch updated training details
    const trainingDetails = await Training.getById(trainingId);
    if (!trainingDetails) {
      return res.status(404).json({ error: "Training details not found" });
    }

    // Step 3: Construct email content
    const emailBody = `
      <p>Dear Students,</p>
      <p>The venue for <b>${trainingDetails.Title}</b> has changed.</p>
      <p>Kindly occupy the mentioned venue untill further notice:</p>
      <p><b>${venueDetails}</b></p>
      
      <p>For any queries, please reach out to the concerned authority.</p>
      <p>Best regards,</p>
      <p>Training & Placement Team</p>
    `;

    // Step 4: Send emails to all provided addresses
    await Promise.all(
      emails.map(email =>
        transporter.sendMail({
          from: process.env.MAIL_USER,
          to: email,
          subject: `Updated Venue for ${trainingDetails.Title}`,
          html: emailBody,
        })
      )
    );

    res.json({ message: "Venue updated and emails sent successfully" });
  } catch (error) {
    console.error("❌ Error updating venue & sending emails:", error);
    res.status(500).json({ error: error.message });
  }
};

