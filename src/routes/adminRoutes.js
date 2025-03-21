// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const trainingController = require('../controller/Training Requests/trainingController');

router.get('/', trainingController.getAdminEmails);
router.get('/:adminMail', trainingController.getTrainingsByAdmin);

module.exports = router;