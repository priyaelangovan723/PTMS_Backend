const express = require('express');
const multer = require('multer');
const router = express.Router();
const mediaController = require('../controller/Media Controller/mediaController')

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), mediaController.uploadMedia);
router.get('/download', mediaController.downloadMedia);
router.get('/:id', mediaController.downloadMediaApex);
router.get('/students/:id', mediaController.downloadMediaStudent);

module.exports = router;
