import React, { useState } from "react";
import "./App.css";

function App() {
  // Initial sample tasks
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete React Assignment",
      description: "Finish the React CRUD application",
      dueDate: "2026-11-15",
      status: "Pending",
    },
    {
      id: 2,
      title: "Study Database Concepts",
      description: "Revise SQL and normalization",
      dueDate: "2026-11-18",
      status: "Completed",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
  });

  const [editId, setEditId] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add or Update Task
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter task title");
      return;
    }

    if (editId !== null) {
      // Update existing task
      setTasks(
        tasks.map((task) =>
          task.id === editId
            ? { ...task, ...formData }
            : task
        )
      );

      setEditId(null);
    } else {
      // Add new task
      const newTask = {
        id: Date.now(),
        ...formData,
      };

      setTasks([...tasks, newTask]);
    }

    resetForm();
  };

  // Edit Task
  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
    });

    setEditId(task.id);
  };

  // Delete Task
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      setTasks(tasks.filter((task) => task.id !== id));

      if (editId === id) {
        resetForm();
      }
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      status: "Pending",
    });

    setEditId(null);
  };

  return (
    <div className="container">
      <h1>Student Task Management</h1>

      <h3>Student: Saranya Kanakala</h3>

      {/* Task Form */}
      <div className="task-form">
        <h2>
          {editId !== null ? "Update Task" : "Add New Task"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Task Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Task Description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />

          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <button type="submit">
            {editId !== null ? "Update Task" : "Add Task"}
          </button>

          {editId !== null && (
            <button
              type="button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Task List */}
      <div className="task-list">
        <h2>My Tasks ({tasks.length})</h2>

        {tasks.length === 0 ? (
          <p>No tasks available. Add your first task!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.dueDate || "Not set"}</td>
                  <td>{task.status}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;