const db = require('../config/db')
class ResponseModels{
    static async createTableIfNotExists(tableName) {
        const query = `
          CREATE TABLE IF NOT EXISTS ${tableName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            responseId VARCHAR(255) UNIQUE,
            name VARCHAR(255),
            email VARCHAR(255),
            roll_no VARCHAR(50),
            interested VARCHAR(10),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        await db.query(query);
      }
    
      static async insertResponse(tableName, responseId, name, email, rollNo, interested, createdAt) {
        const query = `
          INSERT INTO ${tableName} (responseId, name, email, roll_no, interested, created_at)
          VALUES (?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE 
            name = VALUES(name), 
            email = VALUES(email), 
            roll_no = VALUES(roll_no), 
            interested = VALUES(interested),
            created_at = VALUES(created_at)
        `;
        await db.query(query, [responseId, name, email, rollNo, interested, createdAt]);
      }

      static async checkTableExists(tableName){
        const query = `
          SELECT COUNT(*) AS count FROM information_schema.tables 
          WHERE table_schema = DATABASE() AND table_name = ?
        `;
        const [rows] = await db.query(query, [tableName]);
        return rows[0].count > 0;
      };
      
      // Fetch responses from a specific table
      static async getResponsesByTrainingId (trainingId) {
        const tableName = `training_${trainingId}`;
      
        // Check if table exists before querying
        const checkTableQuery = `
          SHOW TABLES LIKE 'training_23';

        `;
        const [tableExists] = await db.query(checkTableQuery, [tableName]);
      
        if (tableExists[0].count === 0) {
          throw new Error(`Table ${tableName} does not exist`);
        }
      
        // Fetch data from the table
        const [rows] = await db.query(`SELECT email FROM ${tableName}`);
        return rows.map(row => row.email);
      };
      
}
module.exports = ResponseModels;