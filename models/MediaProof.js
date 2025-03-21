const db = require('../config/db');

async function saveFile(trainingId, fileName, fileUrl) {
    return db.execute(
        `INSERT INTO media_proofs (trainingId, fileName, fileUrl, lastUpdated) 
         VALUES (?, ?, ?, NOW()) 
         ON DUPLICATE KEY UPDATE fileName=?, fileUrl=?, lastUpdated=NOW()`,
        [trainingId, fileName, fileUrl, fileName, fileUrl]
    );
}

async function getFileByTrainingId(trainingId) {
    const [rows] = await db.execute(
        `SELECT fileName, fileUrl, lastUpdated FROM media_proofs WHERE trainingId = ?`, 
        [trainingId]
    );
    return rows.length ? rows[0] : null;
}

async function updateFileUrl(trainingId, newUrl) {
    return db.execute(
        `UPDATE media_proofs SET fileUrl=?, lastUpdated=NOW() WHERE trainingId=?`,
        [newUrl, trainingId]
    );
}

module.exports = { saveFile, getFileByTrainingId, updateFileUrl };
