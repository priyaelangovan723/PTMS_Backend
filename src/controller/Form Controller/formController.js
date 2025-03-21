const Form = require('../../../models/formModel');
const ResponseModel = require('../../../models/ResponseModel');
const {forms1} = require('../../../services/Google API Services/googleService');
const { google } = require("googleapis");
const auth = new google.auth.GoogleAuth({
  keyFile: "authentication-377904-fe5355a83891.json",
  scopes: [
    "https://www.googleapis.com/auth/forms.body",
    "https://www.googleapis.com/auth/drive.file",
  ],
});

exports.createForm = async (trainingDetails) => {
    try {
        const forms = google.forms({ version: "v1", auth });

        // Generate Google Form
        const formResponse = await forms.forms.create({
            requestBody: { info: { title: `${trainingDetails.Title} Registration` } },
        });

        const formId = formResponse.data.formId;
        const formUrl = `https://docs.google.com/forms/d/${formId}/viewform`;
        const createdOn = new Date().toISOString().slice(0, 19).replace("T", " ");


        // Step 2: Add form fields using batchUpdate
        const batchUpdateRequest = {
            requestBody: {
                requests: [
                    { createItem: { item: { title: "Name", questionItem: { question: { required: true, textQuestion: {} } } }, location: { index: 0 } } },
                    { createItem: { item: { title: "Email ID", questionItem: { question: { required: true, textQuestion: {} } } }, location: { index: 1 } } },
                    { createItem: { item: { title: "Roll No", questionItem: { question: { required: true, textQuestion: {} } } }, location: { index: 2 } } },
                    { createItem: { item: { title: "Interested?", questionItem: { question: { required: true, choiceQuestion: { type: "RADIO", options: [{ value: "Yes" }, { value: "No" }] } } } }, location: { index: 3 } } }
                ]
            }
        };



        await forms.forms.batchUpdate({ formId, requestBody: batchUpdateRequest.requestBody });
        console.log("Form created");

        // Ensure table exists, then insert form data
        await Form.createTableIfNotExists();
        const formEntry = await Form.create({ formUrl, formId, TrainingId: trainingDetails.ID, createdOn });
        console.log(formUrl);
        return { formUrl,formId,formEntry };
         // ✅ Return an object instead of sending a response
  } catch (error) {
    console.error("Error creating form:", error);
    throw new Error("Form creation failed");
  }
};

exports.fetchAllFormResponses = async (req, res) => {
    console.log("⏳ Fetching responses for all forms...");
    const forms = google.forms({ version: "v1", auth });
    try {
      const results = await Form.getAllForms();
      if (results.length === 0) return res.status(404).json({ message: "No forms found" });
  
      let fetchedResponses = [];
  
      for (const row of results) {
        const formId = row.formId;
        const trainingId = row.trainingId;
        const tableName = `training_${trainingId}`;
  
        console.log(`📩 Fetching responses for Form ID: ${formId}`);
  
        try {
          const questionMap = {}; // Map { questionId: "Field Name" }
          const formMetadata = await forms.forms.get({ formId });
  
          formMetadata.data.items.forEach((item) => {
            if (item.questionItem) {
              questionMap[item.questionItem.question.questionId] = item.title;
            }
          });
  
          console.log("✅ Question Mapping:", questionMap);
  
          const response = await forms.forms.responses.list({ formId });
  
          if (response.data.responses && response.data.responses.length > 0) {
            await ResponseModel.createTableIfNotExists(tableName);
  
            for (const formResponse of response.data.responses) {
              const answers = formResponse.answers;
              const parsedResponse = {};
  
              for (const questionId in answers) {
                const fieldName = questionMap[questionId] || `Unknown(${questionId})`;
                parsedResponse[fieldName] = answers[questionId]?.textAnswers?.answers[0]?.value || "N/A";
              }
  
              const name = parsedResponse["Name"] || "N/A";
              const email = parsedResponse["Email ID"] || "N/A";
              const rollNo = parsedResponse["Roll No"] || "N/A";
              const interested = parsedResponse["Interested?"] || "N/A";
              const createdAt = formResponse.createTime ? new Date(formResponse.createTime) : null;
  
              await ResponseModel.insertResponse(tableName, formResponse.responseId, name, email, rollNo, interested, createdAt);

  
              console.log(`✅ Response Stored in ${tableName}:`, name, email, rollNo, interested);
              fetchedResponses.push({ table: tableName, name, email, rollNo, interested });
            }
          } else {
            console.log("⚠️ No responses found.");
          }
        } catch (error) {
          console.error(`❌ Error fetching responses for Form ID ${formId}:`, error.message);
        }
      }
  
      res.json({ message: "Responses fetched successfully", data: fetchedResponses });
    } catch (error) {
      console.error("❌ Unexpected Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
