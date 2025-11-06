
//to veiw web page   http://localhost:3000/  or http://localhost/node

const express = require('express');
const connect = require('./DatabaseConnect'); // Import the reusable database connection module

const app = express();
const port = 3000;

// Serve static files (HTML, CSS, JavaScript) from the "public" folder
app.use(express.static('public'));

// Database configuration
const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school_classes', // Name of your database
};

// Create API endpoint to fetch data from the database
app.get('/api/classes', (req, res) => {
    const connection = connect(config);
    const selectDataQuery = `SELECT * FROM classes`;
    connection.query(selectDataQuery, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            res.status(500).send('Error fetching data');
        } else {
            res.json(results); // Send the data as JSON
        }
        connection.end(); // Close the database connection
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



