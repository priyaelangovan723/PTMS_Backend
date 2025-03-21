const db = require('../config/db');

class AssessmentModels{
    static async getAllAssessments(){
        const [rows] = await db.query('SELECT * FROM assessments');
        return rows;
    }
}

module.exports = AssessmentModels;
