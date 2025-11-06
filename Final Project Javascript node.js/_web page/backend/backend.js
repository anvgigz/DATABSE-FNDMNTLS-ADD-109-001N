const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

//  DB credentials
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Project_db'
}).promise(); // promise API for async/await

// adjust for additional tables  VVV
const allowedTables = ['files', 'projects', 'tasks', 'users','update_project_status'];
const primaryKeys = {
    files: 'file_id',
    projects: 'project_id',
    tasks: 'task_id', 
    users: 'user_id'
};

// Insert route
app.post('/api/insert', async (req, res) => {
    const { tableName, data } = req.body;
    if (!allowedTables.includes(tableName)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }
    const columns = Object.keys(data).map(col => `\`${col}\``).join(',');
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const sql = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
    try {
        const [result] = await db.query(sql, values);
        res.json({ success: true, insertedId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View route
app.get('/api/view', async (req, res) => {
    const table = req.query.table;
    if (!allowedTables.includes(table)) {
        return res.json({ error: 'Invalid table name' });
    }
    try {
        const [results] = await db.query(`SELECT * FROM \`${table}\``);
        res.json(results);
    } catch (err) {
        res.json({ error: err.message });
    }
});

// Edit route
app.put('/api/:table/:id', async (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    if (!allowedTables.includes(table)) {
        console.log(`[PUT] Invalid table: ${table}`);
        return res.status(400).json({ error: 'Invalid table' });
    }
    const pk = primaryKeys[table];
    const data = req.body;
    const columns = Object.keys(data).filter(key => key !== pk);
    if (columns.length === 0) {
        console.log(`[PUT] No fields to update for table: ${table}, id: ${id}`);
        return res.status(400).json({ error: 'No fields to update' });
    }
    const setClause = columns.map(col => `\`${col}\` = ?`).join(', ');
    const values = columns.map(col => data[col]);
    values.push(id);

    // Log the update operation
    console.log(`[PUT] Table: ${table}, PK: ${pk}, ID: ${id}`);
    console.log(`[PUT] Data:`, data);
    console.log(`[PUT] SQL: UPDATE \`${table}\` SET ${setClause} WHERE \`${pk}\` = ?`);
    console.log(`[PUT] Values:`, values);

    try {
        const [result] = await db.query(
            `UPDATE \`${table}\` SET ${setClause} WHERE \`${pk}\` = ?`,
            values
        );
        console.log(`[PUT] Result:`, result);
        if (result.affectedRows === 0) {
            console.log(`[PUT] Row not found for update.`);
            return res.status(404).json({ error: 'Row not found' });
        }
        res.json({ success: true });
    } catch (err) {
        console.log(`[PUT] SQL Error:`, err.message);
        res.status(500).json({ error: err.message });
    }
});

// Delete route
app.delete('/api/:table/:id', async (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    const pk = primaryKeys[table];
    if (!allowedTables.includes(table) || !pk) {
        console.log(`[DELETE] Invalid table: ${table}`);
        return res.status(400).json({ error: 'Invalid table' });
    }
    // Log the delete operation
    console.log(`[DELETE] Table: ${table}, PK: ${pk}, ID: ${id}`);
    try {
        const [result] = await db.query(
            `DELETE FROM \`${table}\` WHERE \`${pk}\` = ?`,
            [id]
        );
        console.log(`[DELETE] Result:`, result);
        if (result.affectedRows === 0) {
            console.log(`[DELETE] Row not found for delete.`);
            return res.status(404).json({ error: 'Row not found' });
        }
        res.json({ success: true });
    } catch (err) {
        console.log(`[DELETE] SQL Error:`, err.message);
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});