// models/Training.js
const db = require('../config/db');
class Training {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM trainings');
        return rows;
    }
    static async getAllstudents() {
        const [rows] = await db.query('SELECT * FROM students');
        return rows;
    }
    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM trainings WHERE ID = ?', [id]);
        return rows[0];
    }
    static async create(data) {
        const { Title, Resource, Domain, Technical, Year, StartDate, EndDate, Description, TrainingStatus, TrainerID, Duration, Assessments, ApexDetails, VenueDetails, SubmittedOn, RequestStatus, Remarks, View, VendorName, Filename, StudentsList, StudentsListFilename, AdminMail } = data;
        const [result] = await db.query('INSERT INTO trainings SET ?', {
            Title, Resource, Domain, Technical, Year, StartDate, EndDate, Description, TrainingStatus, TrainerID, Duration, Assessments, ApexDetails, VenueDetails, SubmittedOn, RequestStatus, Remarks, View, VendorName, Filename, StudentsList, StudentsListFilename, AdminMail
        });
        console.log(result.insertId);
        return result.insertId;
    }


    static async updateTrainingStatus(id, status) {
        await db.query('UPDATE trainings SET TrainingStatus = ? WHERE ID = ?', [status, id]);
        return { message: 'Training status updated successfully' };
    }

    static async updateRequestStatus(id, status, remarks) {
        if (status === 'Rejected' && !remarks) {
            throw new Error('Remarks required when rejecting request');
        }
        await db.query('UPDATE trainings SET RequestStatus = ?, Remarks = ? WHERE ID = ?', [status, remarks || '', id]);
        return { message: 'Request status updated successfully' };
    }
    static async updateVenueDetails(id, venueDetails) {
        await db.query('UPDATE trainings SET VenueDetails = ? WHERE ID = ?', [venueDetails, id]);
        return { message: 'Venue details updated successfully' };
    }

    static async getApexByTrainingId(id) {
        const [rows] = await db.execute(
            `SELECT ApexDetails, filename, alastupdated FROM trainings WHERE ID = ?`,
            [id]
        );
        return rows.length ? rows[0] : null;
    }

    static async getStudentByTrainingId(id) {
        const [rows] = await db.execute(
            `SELECT StudentsList, StudentsListFilename, slastupdated FROM trainings WHERE ID = ?`,
            [id]
        );
        return rows.length ? rows[0] : null;
    }


    static async updateApex(id, newUrl) {
        return db.execute(
            `UPDATE trainings SET ApexDetails=?, alastupdated=NOW() WHERE ID=?`,
            [newUrl, id]
        );
    }

    static async updateStudent(id, newUrl) {
        return db.execute(
            `UPDATE trainings SET StudentsList=?, slastupdated=NOW() WHERE ID=?`,
            [newUrl, id]
        );
    }

    static async getTrainingsByRollNo(rollNo) {
        try {
            console.log("called")
            const connection = await db.getConnection();
            const [rows] = await db.query("CALL new_procedure(?)", [rollNo]);
            connection.release();
            return rows[0];  // The first result set contains the data
        } catch (error) {
            console.error("Database Error:", error);
            throw new Error("Database query failed");
        }
    };

    static async getAllAdmins1() {
        try {
            const [rows] = await db.query(`
                SELECT AdminMail 
                FROM trainings 
                WHERE AdminMail REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$';
            `);
            console.log(rows); // Debugging output
            return rows.map(row => row.AdminMail);
        } catch (error) {
            console.error("Database query error:", error);
            throw new Error("Failed to fetch Admin Mails");
        }
    }
    


}
module.exports = Training;