const mysql = require('mysql2/promise'); // Import the promise-based MySQL2 module
const connect = require('../../imports/DatabaseConnect'); // Import the reusable connect module
const useQuery = require('../../imports/Custom Query'); // Import the custom query module

// Database configuration
const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Project_db',
};

(async () => {
    const connection = await mysql.createConnection(config); // Use promise-based connection

    try {
        // Define the table name
        const tableName = 'Files';

        // Update Data
        const updateLogMessage = `Updating location in ${tableName} table`;
        const updateQuery = `UPDATE Files SET file_path = ? WHERE file_id = ?`;
        const values = ['C:\\xampp\\htdocs\\node_project\\backup3', 2];

        // Execute the update query
        await connection.execute(updateQuery, values);
        console.log(`Updated file_path for file_id = ${values[1]}`);

        // Fetch All Data to verify update
        const selectLogMessage = `Fetching all data from ${tableName} table`;
        const [result] = await connection.execute(`SELECT * FROM ${tableName}`);
        
        console.log('Updated Table Data:');
        console.table(result);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        // Close the connection
        await connection.end();
        console.log('Connection closed.');
    }
})();