const connect = require('../../imports/DatabaseConnect'); // Import the reusable connect module
const useQuery = require('../../imports/DatabaseQuery'); // Import the reusable query module

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
            DROP TABLE IF EXISTS Projects;
            `;
        await query(createDatabaseQuery); // Execute the query
        console.log('Query Executed: DROP TABLE IF EXISTS Projects');
        console.log('Table "Projects" Deleted or already does not exist.');

        // Query to describe the table
        const describeTableQuery = `DESCRIBE Projects`;
        const tableStructure = await query(describeTableQuery);
        console.log('Table Structure:');
        console.table(tableStructure);

        // Query to fetch the data in the table
        const selectDataQuery = `SELECT * FROM Projects`;
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
