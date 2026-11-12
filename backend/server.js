const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Task routes
const taskRoutes = require("./routes/tasks");

app.use("/tasks", taskRoutes);

// Default route
app.get("/", (req, res) => {
    res.send("Student Task Management API is running!");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});