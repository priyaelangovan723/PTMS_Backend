const express = require('express');
const bodyParser = require('body-parser');
const trainingRoutes = require('./src/routes/trainingRoutes');
const mediaRoutes = require('./src/routes/mediaRoutes');
const emailRoutes = require('./src/routes/emailRoutes');
const formRoutes = require("./src/routes/formRoutes");
const responsesRoutes = require("./src/routes/responseRoutes");
const studentRoutes = require ("./src/routes/studentRoutes");
const adminRoutes = require('./src/routes/adminRoutes')
const cors = require("cors");


const assessmentRoutes = require('./src/routes/assessmentRoutes')
const app = express();
app.use(cors());
app.use(express.json()); 
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use('/students',studentRoutes);
app.use('/api/trainings', trainingRoutes);
app.use('/media', mediaRoutes);
app.use('/assessments', assessmentRoutes);
app.use("/emails", emailRoutes);
app.use("/forms", formRoutes);
app.use("/responses",responsesRoutes);
app.use("/admins",adminRoutes)
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${server.address().port}`);
  });
setInterval(() => {
    fetch(`http://localhost:${server.address().port}/forms/fetch-all-responses`)
      .then((res) => res.json())
      .then((data) => console.log("✅ Scheduled Fetch Success:", data))
      .catch((err) => console.error("❌ Scheduled Fetch Error:", err));
  }, 30000);