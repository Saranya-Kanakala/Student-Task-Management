const express = require("express");
const router = express.Router();

const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../controllers/tasks.js");

// POST - Create task
router.post("/", createTask);

// GET - Get all tasks
router.get("/", getAllTasks);

// GET - Get task by ID
router.get("/:id", getTaskById);

// PATCH - Update task
router.patch("/:id", updateTask);

// DELETE - Delete task
router.delete("/:id", deleteTask);

module.exports = router;