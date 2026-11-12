const db = require("../config/DatabaseInitializer");

// 1. CREATE TASK (POST)
exports.createTask = (req, res) => {
    const {
        student_name,
        title,
        description,
        subject,
        due_date,
        status
    } = req.body;

    if (!student_name || !title) {
        return res.status(400).json({
            message: "Student name and title are required"
        });
    }

    const sql = `
        INSERT INTO tasks
        (student_name, title, description, subject, due_date, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        student_name,
        title,
        description || null,
        subject || null,
        due_date || null,
        status || "pending"
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error creating task",
                error: err.message
            });
        }

        res.status(201).json({
            message: "Task created successfully",
            taskId: result.insertId
        });
    });
};


// 2. GET ALL TASKS (GET)
exports.getAllTasks = (req, res) => {
    const sql = "SELECT * FROM tasks ORDER BY created_at DESC";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching tasks",
                error: err.message
            });
        }

        res.status(200).json({
            message: "Tasks fetched successfully",
            total: results.length,
            tasks: results
        });
    });
};


// 3. GET TASK BY ID (GET)
exports.getTaskById = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM tasks WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching task",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task fetched successfully",
            task: results[0]
        });
    });
};


// 4. UPDATE TASK (PATCH)
exports.updateTask = (req, res) => {
    const { id } = req.params;

    const allowedFields = [
        "student_name",
        "title",
        "description",
        "subject",
        "due_date",
        "status"
    ];

    const fields = Object.keys(req.body).filter(field =>
        allowedFields.includes(field)
    );

    if (fields.length === 0) {
        return res.status(400).json({
            message: "Provide at least one valid field to update"
        });
    }

    const updates = fields.map(field => `${field} = ?`).join(", ");

    const values = fields.map(field => req.body[field]);

    const sql = `UPDATE tasks SET ${updates} WHERE id = ?`;

    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error updating task",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully"
        });
    });
};


// 5. DELETE TASK (DELETE)
exports.deleteTask = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM tasks WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error deleting task",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });
    });
};