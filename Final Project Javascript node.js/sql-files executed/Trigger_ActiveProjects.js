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
        // Drop triggers if they exist
        await query(`DROP TRIGGER IF EXISTS ActiveProjects;`);
        await query(`DROP TRIGGER IF EXISTS ProjectNotCompleteOnInsert;`);
        console.log('Dropped triggers if they existed.');

        // C AFTER UPDATE trigger
        const createUpdateTrigger = `
CREATE TRIGGER ActiveProjects
AFTER UPDATE ON Tasks
FOR EACH ROW
BEGIN
    -- If a task is marked as Completed, check if all are completed
    IF NEW.status = 'Completed' THEN
        IF NOT EXISTS (
            SELECT 1 FROM Tasks
            WHERE project_id = NEW.project_id AND status != 'Completed'
        ) THEN
            UPDATE Projects
            SET description = 
                CASE 
                    WHEN description LIKE '%[All tasks completed]%' THEN description
                    ELSE CONCAT(description, ' [All tasks completed]')
                END
            WHERE project_id = NEW.project_id;
        END IF;
    END IF;

    -- If a task is reverted to not completed, remove the tag if present
    IF NEW.status != 'Completed' THEN
        UPDATE Projects
        SET description = TRIM(REPLACE(description, ' [All tasks completed]', ''))
        WHERE project_id = NEW.project_id
        AND description LIKE '%[All tasks completed]%';
    END IF;
END
`;

        //Insert trigger
        const createInsertTrigger = `
CREATE TRIGGER ProjectNotCompleteOnInsert
AFTER INSERT ON Tasks
FOR EACH ROW
BEGIN
    -- When a new task is added, remove the [All tasks completed] tag if present
    UPDATE Projects
    SET description = TRIM(REPLACE(description, ' [All tasks completed]', ''))
    WHERE project_id = NEW.project_id
    AND description LIKE '%[All tasks completed]%';
END
`;

        //  AFTER DELETE trigger
        const createDeleteTrigger = `
CREATE TRIGGER ProjectCompleteOnDelete
AFTER DELETE ON Tasks
FOR EACH ROW
BEGIN
    -- If the deleted task was not completed, check if all remaining tasks are completed
    IF OLD.status != 'Completed' THEN
        IF NOT EXISTS (
            SELECT 1 FROM Tasks
            WHERE project_id = OLD.project_id AND status != 'Completed'
        ) THEN
            UPDATE Projects
            SET description = 
                CASE 
                    WHEN description LIKE '%[All tasks completed]%' THEN description
                    ELSE CONCAT(description, ' [All tasks completed]')
                END
            WHERE project_id = OLD.project_id;
        END IF;
    END IF;

    -- Always remove the tag if any tasks remain and the tag is present (handles the case where a completed task is deleted)
    IF EXISTS (
        SELECT 1 FROM Tasks
        WHERE project_id = OLD.project_id AND status != 'Completed'
    ) THEN
        UPDATE Projects
        SET description = TRIM(REPLACE(description, ' [All tasks completed]', ''))
        WHERE project_id = OLD.project_id
        AND description LIKE '%[All tasks completed]%';
    END IF;
END
`;

        await query(createUpdateTrigger);
        await query(createInsertTrigger);
        await query(createDeleteTrigger);
        console.log('Triggers "ActiveProjects", "ProjectNotCompleteOnInsert", and "ProjectCompleteOnDelete" created.');

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