const connect = require('../imports/DatabaseConnect'); // Import the reusable connect module
const useQuery = require('../imports/DatabaseQuery'); // Import the reusable query module

// Database configuration
const config = {
    host: 'localhost',    // Your database host
    user: 'root',         // Your MySQL username
    password: '',         // Your MySQL password
    database: 'Project_db'
};

// Connect to the MySQL server using the reusable module
const connection = connect(config);

// Wrap the connection.query using the reusable query module
const query = useQuery(connection);

(async () => {
    try {
        // SQL query to create the database
        const createDatabaseQuery = `
            CREATE TABLE IF NOT EXISTS Users (
            user_id INT PRIMARY KEY AUTO_INCREMENT, /* Unique ID */
            username VARCHAR(50) NOT NULL,          /* Username as text */
            email VARCHAR(100) UNIQUE NOT NULL CHECK (email LIKE '%@%'), /* Basic format check */
            account_type ENUM('admin', 'user') NOT NULL DEFAULT 'user', /* Account type */
            password_hash VARCHAR(255) NOT NULL DEFAULT (SHA2(UUID(), 256));

            salt VARCHAR(255) NOT NULL,             /* Random salt for added security */
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP /* Created at timestamp */
            );
        `;
        await query(createDatabaseQuery); // Execute the query
        console.log('Query Executed: CREATE TABLE IF NOT EXISTS Users');
        console.log('Table "Users" created or already exists.');

        // Query to describe the table
        const describeTableQuery = `DESCRIBE Users`;
        const tableStructure = await query(describeTableQuery);
        console.log('Table Structure:');
        console.table(tableStructure);

        // Query to fetch the data in the table
        const selectDataQuery = `SELECT * FROM Users`;
        const tableData = await query(selectDataQuery);
        console.log('Table Data:');
        console.table(tableData);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        // Close the connection
        connection.end((endErr) => {
            if (endErr) {
                console.error('Error closing the connection:', endErr.message);
            } else {
                console.log('Connection closed.');
            }
        });
    }
})();