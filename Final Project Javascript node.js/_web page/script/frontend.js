const tableSchemas = {
    files: ['file_id', 'project_id', 'file_name', 'file_path', 'notes'],
    projects: ['project_id', 'user_id', 'title', 'description'],
    tasks: ['task_id', 'project_id', 'task_name', 'status', 'due_date', 'notes'],
    users: ['user_id', 'username', 'email', 'account_type'],
};
const tablePrimaryKeys = {
    files: 'file_id',
    projects: 'project_id',
    tasks: 'task_id',
    users: 'user_id'
};




// Dynamically update form fields for insert
function updateFormFields() {
    const tableName = document.getElementById('tableName').value;
    const fieldsContainer = document.getElementById('fieldsContainer');
    fieldsContainer.innerHTML = '';
    if (tableSchemas[tableName]) {
        tableSchemas[tableName].forEach(field => {
            const label = document.createElement('label');
            label.textContent = `${field}: `;
            const input = document.createElement('input');
            input.type = 'text';
            input.name = field;
            input.required = true;
            label.appendChild(input);
            fieldsContainer.appendChild(label);
            fieldsContainer.appendChild(document.createElement('br'));
        });
    }
}

// Handle insert form submit
async function handleSubmit(event) {
    event.preventDefault();
    const tableName = document.getElementById('tableName').value;
    const data = {};
    document.querySelectorAll('#fieldsContainer input').forEach(input => {
        data[input.name] = input.value;
    });
    try {
        const response = await fetch('http://localhost:3000/api/insert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tableName, data }),
        });
        const result = await response.json();
        if (result.error) {
            alert('Insert failed: ' + result.error);
        } else {
            alert('Insert successful!');
            window.viewTableData();
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Render table with Edit/Delete actions
function renderTableWithActions(data, tableName) {
    if (!data.length) {
        document.getElementById('tableData').innerHTML = '<p>No data found.</p>';
        return;
    }
    let html = '<table border="1"><thead><tr>';
    Object.keys(data[0]).forEach(key => {
        html += `<th>${key}</th>`;
    });
    html += '<th>Actions</th></tr></thead><tbody>';
    data.forEach(row => {
        html += '<tr>';
        Object.values(row).forEach(val => {
            html += `<td>${val}</td>`;
        });
        let rowStr = encodeURIComponent(JSON.stringify(row));
        html += `<td>
            <button onclick="window.editRow(&quot;${tableName}&quot;, &quot;${rowStr}&quot;)">Edit</button>
            <button onclick="window.deleteRow(&quot;${tableName}&quot;, &quot;${rowStr}&quot;)">Delete</button>
        </td></tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('tableData').innerHTML = html;
}

// Fetch and display table data with actions
window.viewTableData = async function() {
    const tableName = document.getElementById('viewTableName').value;
    if (!tableName) return alert('Please select a table.');
    const res = await fetch(`http://localhost:3000/api/view?table=${encodeURIComponent(tableName)}`);
    const data = await res.json();
    if (data.error) {
        document.getElementById('tableData').innerHTML = `<p style="color:red;">${data.error}</p>`;
        return;
    }
    renderTableWithActions(data, tableName);
};

// Edit row logic with modal
window.editRow = function(tableName, rowStr) {
    console.log('editRow called for', tableName, rowStr);
    const row = JSON.parse(decodeURIComponent(rowStr));
    const primaryKey = tablePrimaryKeys[tableName];
    const modal = document.createElement('div');
    modal.id = 'editModal';
    modal.style = `
        position:fixed;
        top:10%;
        left:30%;
        background:#fff;
        border:1px solid #ccc;
        padding:20px;
        z-index:1000;
        max-height:80vh;
        overflow:auto;
    `;

    let formHtml = '<form id="editForm">';
    Object.entries(row).forEach(([key, value]) => {
        formHtml += `<label>${key}: <input name="${key}" value="${value}" ${key === primaryKey ? 'readonly' : ''}></label><br>`;
    });
    formHtml += `<button type="submit">Save</button>
        <button type="button" onclick="document.body.removeChild(document.getElementById('editModal'))">Cancel</button>
        </form>`;
    modal.innerHTML = `<h3>Edit Row</h3>${formHtml}`;
    document.body.appendChild(modal);

    document.getElementById('editForm').onsubmit = async function(e) {
        console.log('editForm submitted');
        e.preventDefault();
        const formData = new FormData(e.target);
        const updated = {};
        formData.forEach((v, k) => updated[k] = v);
        try {
            const response = await fetch(`http://localhost:3000/api/${tableName}/${row[primaryKey]}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updated)
            });
            const result = await response.json();
            if (!response.ok) {
                alert('Edit failed: ' + (result.error || response.statusText));
                return;
            }
        } catch (err) {
            alert('Network error: ' + err.message);
            return;
        }
        document.body.removeChild(modal);
        window.viewTableData();
    };
};

// Delete row logic
window.deleteRow = async function(tableName, rowStr) {
    const row = JSON.parse(decodeURIComponent(rowStr));
    const primaryKey = tablePrimaryKeys[tableName];
    if (!confirm('Are you sure you want to delete this row?')) return;
    try {
        const response = await fetch(`http://localhost:3000/api/${tableName}/${row[primaryKey]}`, { method: 'DELETE' });
        const result = await response.json();
        if (!response.ok) {
            alert('Delete failed: ' + (result.error || response.statusText));
            return;
        }
        window.viewTableData();
    } catch (err) {
        alert('Network error: ' + err.message);
    }
};

////
async function loadProjectStatusView() {
    try {
        const res = await fetch('http://localhost:3000/api/view?table=update_project_status');
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById('projectStatusView').innerHTML = '<p>No project status data found.</p>';
            return;
        }
        let html = '<table border="1"><thead><tr>';
        Object.keys(data[0]).forEach(key => {
            html += `<th>${key}</th>`;
        });
        html += '</tr></thead><tbody>';
        data.forEach(row => {
            html += '<tr>';
            Object.values(row).forEach(val => {
                html += `<td>${val !== null ? val : ''}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table>';
        document.getElementById('projectStatusView').innerHTML = html;
    } catch (err) {
        document.getElementById('projectStatusView').innerHTML = `<p style="color:red;">Error loading project status: ${err.message}</p>`;
    }
}

// Load the view when the page loads
window.addEventListener('DOMContentLoaded', loadProjectStatusView);

// Optionally, call loadProjectStatusView() after any insert/update/delete to keep it updated.

// Expose functions for HTML
window.updateFormFields = updateFormFields;
window.handleSubmit = handleSubmit;