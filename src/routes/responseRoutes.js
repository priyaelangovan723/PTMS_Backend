const express = require("express");
const router = express.Router();
const responsesController = require("../controller/Response Controller/responseController");

// Route to fetch responses based on trainingId
router.get("/fetch-responses/:trainingId", responsesController.fetchResponses);

module.exports = router;
