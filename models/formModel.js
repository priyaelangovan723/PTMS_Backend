const db = require('../config/db');

class Form {
    static async createTableIfNotExists() {
        await db.query(`
            CREATE TABLE IF NOT EXISTS forms (
                id INT AUTO_INCREMENT PRIMARY KEY,
                formUrl VARCHAR(255) NOT NULL,
                formId VARCHAR(255) NOT NULL UNIQUE,
                TrainingId INT NOT NULL UNIQUE,
                createdOn DATETIME NOT NULL
            )
        `);
    }

    static async getAll() {
        const [rows] = await db.query('SELECT * FROM forms');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM forms WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        await Form.createTableIfNotExists();  // Ensure table exists before inserting

        const { formUrl, formId, TrainingId, createdOn } = data;
        const [result] = await db.query('INSERT INTO forms SET ?', {
            formUrl, formId, TrainingId, createdOn
        });
        return result.insertId;
    }

    static async getByFormId(formId) {
        const [rows] = await db.query('SELECT * FROM forms WHERE formId = ?', [formId]);
        return rows.length ? rows[0] : null;
    }

    static async getByTrainingId(trainingId) {
        const [rows] = await db.query('SELECT * FROM forms WHERE TrainingId = ?', [trainingId]);
        return rows;
    }

    static async getAllForms() {
        const sql = "SELECT formId, trainingId FROM forms";
        const [rows] = await db.query(sql);
        return rows;
      }
}

module.exports = Form;
