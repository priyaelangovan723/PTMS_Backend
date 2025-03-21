const fs = require('fs');
const { uploadFile, generateDownloadUrl, generateDownloadUrlApex, generateDownloadUrlStudent, generatePreSignedUrl } = require('../../../services/Backblaze/backblazeService');
const MediaProof = require('../../../models/MediaProof');
const training = require('../../../models/Training')

async function uploadMedia(req, res) {
    if (!req.file || !req.body.trainingId) {
        return res.status(400).json({ message: 'File and trainingId are required' });
    }

    try {
        const { fileUrl, fileName } = await uploadFile(req.file.path, req.file.originalname, req.file.mimetype, req.body.trainingId);

        await MediaProof.saveFile(req.body.trainingId, fileName, fileUrl);

        res.json({ downloadUrl: fileUrl });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
}

async function downloadMedia(req, res) {
    const { trainingId } = req.query;
    if (!trainingId) {
        return res.status(400).json({ message: 'trainingId is required' });
    }

    try {
        const fileData = await MediaProof.getFileByTrainingId(trainingId);
        if (!fileData) {
            return res.status(404).json({ message: 'No file found for this trainingId' });
        }

        const { fileName, fileUrl, lastUpdated } = fileData;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const lastUpdatedDate = new Date(lastUpdated);

        let finalUrl = fileUrl;
        if (lastUpdatedDate < sevenDaysAgo) {
            finalUrl = await generateDownloadUrl(fileName);
            await MediaProof.updateFileUrl(trainingId, finalUrl);
        }

        res.json({ downloadUrl: finalUrl });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'Failed to retrieve file', error: error.message });
    }
}

async function downloadMediaApex(req, res) {
    
    const { id } = req.params; // Get ID from URL params
    if (!id) {
        return res.status(400).json({ message: 'ID is required' });
    }
    try {
        const fileData = await training.getApexByTrainingId(id);
        if (!fileData) {
            return res.status(404).json({ message: 'No file found for this trainingId' });
        }

        const { filename, ApexDetails, alastupdated } = fileData;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const lastUpdatedDate = new Date(alastupdated);

        let finalUrl = ApexDetails;
        if (lastUpdatedDate < sevenDaysAgo) {
            finalUrl = await generateDownloadUrlApex(filename);
            await training.updateApex(id, finalUrl);
        }

        res.json({ downloadUrl: finalUrl });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'Failed to retrieve file', error: error.message });
    }
}

async function downloadMediaStudent(req, res) {
    
    const { id } = req.params; // Get ID from URL params
    if (!id) {
        return res.status(400).json({ message: 'ID is required' });
    }
    try {
        const fileData = await training.getStudentByTrainingId(id);
        if (!fileData) {
            return res.status(404).json({ message: 'No file found for this trainingId' });
        }

        const { StudentsListFilename, StudentsList, slastupdated } = fileData;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const lastUpdatedDate = new Date(slastupdated);

        let finalUrl = StudentsList;
        if (lastUpdatedDate < sevenDaysAgo) {
            finalUrl = await generateDownloadUrl(StudentsListFilename);
            await training.updateStudent(id, finalUrl);
        }

        res.json({ downloadUrl: finalUrl });
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ message: 'Failed to retrieve file', error: error.message });
    }
}



module.exports = { uploadMedia, downloadMedia,downloadMediaApex, downloadMediaStudent };
