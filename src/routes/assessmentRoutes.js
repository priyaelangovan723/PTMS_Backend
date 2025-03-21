const express = require('express');
const router = express.Router();
const assessmentController = require('../controller/Assessments/assessmentController');

router.get('/', assessmentController.getAssessments);

module.exports = router;
