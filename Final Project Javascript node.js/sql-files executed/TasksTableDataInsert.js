const connect = require('../imports/DatabaseConnect'); // Import the reusable connect module
const useQuery = require('../imports/Custom Query'); // Import the custom query module

// Database configuration
const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Project_db',
};

// Connect to the MySQL server using the reusable module
const connection = connect(config);

// Wrap the connection.query using the customizable query module
const dynamicQuery = useQuery(connection);

(async () => {
    try {
        // Define the table name and log message
        const tableName = 'Tasks';

        // Insert Data
        const insertLogMessage = `Inserting data into ${tableName} table`;
        const userData = {
            Project_id: 1,
            task_name: 'create web GUI for database',
            status: 'Pending',
            due_date: '2025-06-30',
        };
        await dynamicQuery({ tableName, logMessage: insertLogMessage, queryType: 'INSERT', data: userData });

        // Fetch All Data
        const selectLogMessage = `Fetching all data from ${tableName} table`;
        await dynamicQuery({ tableName, logMessage: selectLogMessage, queryType: 'SELECT' });
    } finally {
        connection.end((endErr) => {
            if (endErr) {
                console.error('Error closing the connection:', endErr.message);
            } else {
                console.log('Connection closed.');
            }
        });
    }
})();