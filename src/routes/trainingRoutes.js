// routes/trainingRoutes.js
const express = require('express');
const multer = require('multer');
const { getAllTrainings, getTrainingById, createTraining, updateTrainingStatus,updateRequestStatus, updateVenueDetails,getTrainings,getAdminEmails } = require('../controller/Training Requests/trainingController');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.get('/', getAllTrainings);
router.get('/:id', getTrainingById);
router.post('/', upload.fields([
    { name: 'ApexDetails', maxCount: 1 },
    { name: 'studentListFile', maxCount: 1 }
]), createTraining);

router.put('/:id/status', updateTrainingStatus);
router.put('/:id/request-status', updateRequestStatus);
router.put('/:id/venue', updateVenueDetails);
router.get("/:rollNo", getTrainings);
router.get('/get-admin-emails', getAdminEmails);

module.exports = router;