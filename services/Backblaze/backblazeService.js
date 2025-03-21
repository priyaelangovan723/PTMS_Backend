const fs = require('fs');
const B2 = require('backblaze-b2');
const { saveFile, getFileByTrainingId, updateFileUrl } = require('../../models/MediaProof');
require('dotenv').config();

const b2 = new B2({
    applicationKeyId: process.env.B2_KEY_ID,
    applicationKey: process.env.B2_APP_KEY,
});

const BUCKET_ID = process.env.B2_BUCKET_ID;
const BUCKET_NAME = "Media-proofs";

const BUCKET_ID_Apex = process.env.B2_BUCKET_ID_Apex;
const BUCKET_NAME_Apex = "ApexDetails";

const BUCKET_ID_StudentList =process.env.B2_BUCKET_ID_StudentList;
const BUCKET_NAME_StudentList = "StudentList";

async function authorize() {
    await b2.authorize();
}

async function uploadFile(filePath, originalName, mimeType, trainingId) {
    try {
        await authorize();

        const { data: { uploadUrl, authorizationToken } } = await b2.getUploadUrl({ bucketId: BUCKET_ID });

        const fileData = fs.readFileSync(filePath);
        const fileName = `${Date.now()}-${originalName}`;

        await b2.uploadFile({
            uploadUrl,
            uploadAuthToken: authorizationToken,
            fileName,
            data: fileData,
            contentType: mimeType,
        });

        const { data: { authorizationToken: authToken } } = await b2.getDownloadAuthorization({
            bucketId: BUCKET_ID,
            fileNamePrefix: fileName,
            validDurationInSeconds: 7 * 24 * 60 * 60,
        });

        const fileUrl = `https://f005.backblazeb2.com/file/${BUCKET_NAME}/${fileName}?Authorization=${authToken}`;

        fs.unlinkSync(filePath); // Remove local file

        return { fileUrl, fileName };
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error('Upload failed: ' + error.message);
    }
}

async function generateDownloadUrl(fileName) {
    try {
        await authorize();
        const { data: { authorizationToken: authToken } } = await b2.getDownloadAuthorization({
            bucketId: BUCKET_ID,
            fileNamePrefix: fileName,
            validDurationInSeconds: 7 * 24 * 60 * 60,
        });

        return `https://f005.backblazeb2.com/file/${BUCKET_NAME}/${fileName}?Authorization=${authToken}`;
    } catch (error) {
        console.error('Download URL error:', error);
        throw new Error('Failed to generate download URL: ' + error.message);
    }
}

async function uploadApex(filePath, originalName, mimeType) {
    try {
        await authorize();

        const { data: { uploadUrl, authorizationToken } } = await b2.getUploadUrl({ bucketId: BUCKET_ID_Apex });

        const fileData = fs.readFileSync(filePath);
        const fileName = `${Date.now()}-${originalName}`;

        await b2.uploadFile({
            uploadUrl,
            uploadAuthToken: authorizationToken,
            fileName,
            data: fileData,
            contentType: mimeType,
        });

        const { data: { authorizationToken: authToken } } = await b2.getDownloadAuthorization({
            bucketId: BUCKET_ID_Apex,
            fileNamePrefix: fileName,
            validDurationInSeconds: 7 * 24 * 60 * 60,
        });

        const fileUrl = `https://f005.backblazeb2.com/file/${BUCKET_NAME_Apex}/${fileName}?Authorization=${authToken}`;

        fs.unlinkSync(filePath); // Remove local file

        return { fileUrl, fileName };
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error('Upload failed: ' + error.message);
    }
}

async function generateDownloadUrlApex(fileName) {
    try {
        await authorize();
        const { data: { authorizationToken: authToken } } = await b2.getDownloadAuthorization({
            bucketId: BUCKET_ID_Apex,
            fileNamePrefix: fileName,
            validDurationInSeconds: 7 * 24 * 60 * 60,
        });

        return `https://f005.backblazeb2.com/file/${BUCKET_NAME_Apex}/${fileName}?Authorization=${authToken}`;
    } catch (error) {
        console.error('Download URL error:', error);
        throw new Error('Failed to generate download URL: ' + error.message);
    }
}

async function uploadStudentList(filePath, originalName, mimeType) {
    try {
        await authorize();

        const { data: { uploadUrl, authorizationToken } } = await b2.getUploadUrl({ bucketId: BUCKET_ID_StudentList });

        const fileData = fs.readFileSync(filePath);
        const fileName = `${Date.now()}-${originalName}`;

        await b2.uploadFile({
            uploadUrl,
            uploadAuthToken: authorizationToken,
            fileName,
            data: fileData,
            contentType: mimeType,
        });

        const { data: { authorizationToken: authToken } } = await b2.getDownloadAuthorization({
            bucketId: BUCKET_ID_StudentList,
            fileNamePrefix: fileName,
            validDurationInSeconds: 7 * 24 * 60 * 60,
        });

        const fileUrl = `https://f005.backblazeb2.com/file/${BUCKET_NAME_StudentList}/${fileName}?Authorization=${authToken}`;

        fs.unlinkSync(filePath); // Remove local file

        return { fileUrl, fileName };
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error('Upload failed: ' + error.message);
    }
}

async function generateDownloadUrlStudent(fileName) {
    try {
        await authorize();
        const { data: { authorizationToken: authToken } } = await b2.getDownloadAuthorization({
            bucketId: BUCKET_ID_StudentList,
            fileNamePrefix: fileName,
            validDurationInSeconds: 7 * 24 * 60 * 60,
        });

        return `https://f005.backblazeb2.com/file/${BUCKET_NAME_StudentList}/${fileName}?Authorization=${authToken}`;
    } catch (error) {
        console.error('Download URL error:', error);
        throw new Error('Failed to generate download URL: ' + error.message);
    }
}




module.exports = { uploadFile, generateDownloadUrl, uploadApex, generateDownloadUrlApex, uploadStudentList, generateDownloadUrlStudent };