const connect = require('../imports/DatabaseConnect');
const useQuery = require('../imports/DatabaseQuery');

// Database configuration
const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Project_db'
};

const connection = connect(config);
const query = useQuery(connection);

(async () => {
    try {
        // Drop the view if it exists (idempotent)
        await query(`DROP VIEW IF EXISTS Update_Project_Status;`);
        console.log('Dropped view "Update_Project_Status" if it existed.');

        // Create the view
        const createView = `
CREATE VIEW Update_Project_Status AS
SELECT 
    p.project_id,
    p.title,
    p.description,
    t.task_id,
    t.task_name,
    t.status,
    t.due_date,
    t.notes AS task_notes
FROM Projects p
LEFT JOIN Tasks t ON p.project_id = t.project_id AND t.status != 'Completed'
ORDER BY p.project_id, t.due_date
        `;
        await query(createView);
        console.log('View "Update_Project_Status" created.');

        // Optionally, display the view's contents
        const results = await query('SELECT * FROM Update_Project_Status;');
        console.log('Sample data from Update_Project_Status:');
        console.table(results);

    } catch (err) {
        console.error('Error:', err.message);
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