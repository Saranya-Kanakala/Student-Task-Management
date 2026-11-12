import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/tasks";

function App() {
  const [tasks, setTasks] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
  });

  const [editId, setEditId] = useState(null);

  // GET ALL TASKS
  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      alert("Unable to load tasks. Check your backend server.");
    }
  };

  // Load tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle input changes
  const handleChange = (e:any) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ADD OR UPDATE TASK
  const handleSubmit = async (e:any) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter task title");
      return;
    }

    const taskData = {
      student_name: "Saranya Kanakala",
      title: formData.title,
      description: formData.description,
      subject: "General",
      due_date: formData.dueDate || null,
      status: formData.status,
    };

    try {
      let response;

      if (editId !== null) {
        // PATCH - Update existing task
        response = await fetch(`${API_URL}/${editId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });
      } else {
        // POST - Create new task
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Operation failed");
      }

      alert(result.message);

      resetForm();

      // Refresh tasks from MySQL
      fetchTasks();

    } catch (error:any) {
      console.error("Submit Error:", error);
      alert(error.message || "Something went wrong");
    }
  };

  // EDIT TASK
  const handleEdit = (task:any) => {
    setFormData({
      title: task.title,
      description: task.description || "",
      dueDate: task.due_date
        ? String(task.due_date).slice(0, 10)
        : "",
      status: task.status,
    });

    setEditId(task.id);
  };

  // DELETE TASK
  const handleDelete = async (id:any) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Delete failed");
        }

        alert(result.message);

        if (editId === id) {
          resetForm();
        }

        // Refresh tasks from MySQL
        fetchTasks();

      } catch (error:any) {
        console.error("Delete Error:", error);
        alert(error?.message || "Unable to delete task");
      }
    }
  };

  // RESET FORM
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      status: "pending",
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
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
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
              {tasks.map((task:any) => (
                <tr key={task.id}>
                  <td>{task.title}</td>

                  <td>{task.description}</td>

                  <td>
                    {task.due_date
                      ? String(task.due_date).slice(0, 10)
                      : "Not set"}
                  </td>

                  <td>
                    {task.status === "in-progress"
                      ? "In Progress"
                      : task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)}
                  </td>

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

export default App