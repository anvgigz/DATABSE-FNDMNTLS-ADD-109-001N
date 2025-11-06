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
        const tableName = 'Users';
        const logMessage = `Inserting data into ${tableName} table`;

        // Data to insert
        const userData = {
            username: 'Stephen Krohn',
            email: 'stephen@gmail.com',
            password_hash: 'hashed_password456',
        };

        // Insert data into the table
        await dynamicQuery({ tableName, logMessage, queryType: 'INSERT', data: userData });
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