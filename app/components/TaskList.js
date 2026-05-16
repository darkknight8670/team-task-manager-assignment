"use client";

import { useState } from "react";
import styles from "../dashboard.module.css";

export default function TaskList({ projectId, tasks, users, isAdmin, currentUserId }) {
  const [taskList, setTaskList] = useState(tasks);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assigneeId: "",
  });

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });

      if (res.ok) {
        setTaskList(prev => 
          prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTask, projectId }),
      });

      if (res.ok) {
        const addedTask = await res.json();
        // Fetch users again to get the assignee object or find it in current users list
        const assignee = users.find(u => u.id === newTask.assigneeId);
        setTaskList([{ ...addedTask, assignee }, ...taskList]);
        setNewTask({ title: "", description: "", priority: "MEDIUM", assigneeId: "" });
        setShowAddForm(false);
      }
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Tasks</h2>
        {isAdmin && (
          <button 
            className={styles.btnPrimary}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? "Cancel" : "+ Add Task"}
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAddTask} className={styles.statCard} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "grid", gap: "1rem" }}>
            <input 
              type="text" 
              placeholder="Task Title" 
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              required
              style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
            />
            <textarea 
              placeholder="Description" 
              value={newTask.description}
              onChange={e => setNewTask({...newTask, description: e.target.value})}
              style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd" }}
            />
            <div style={{ display: "flex", gap: "1rem" }}>
              <select 
                value={newTask.priority}
                onChange={e => setNewTask({...newTask, priority: e.target.value})}
                style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd", flex: 1 }}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <select 
                value={newTask.assigneeId}
                onChange={e => setNewTask({...newTask, assigneeId: e.target.value})}
                style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ddd", flex: 1 }}
              >
                <option value="">Select Assignee</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className={styles.btnPrimary}>Create Task</button>
          </div>
        </form>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {taskList.map(task => (
          <div key={task.id} className={styles.statCard} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{task.title}</h3>
              <p style={{ margin: "0.2rem 0", fontSize: "0.9rem", color: "#666" }}>{task.description}</p>
              <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.8rem", marginTop: "0.5rem" }}>
                <span style={{ color: task.priority === "HIGH" ? "red" : "#666" }}>
                  Priority: {task.priority}
                </span>
                <span>•</span>
                <span>Assignee: {task.assignee?.name || "Unassigned"}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <select 
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                style={{ padding: "0.4rem", borderRadius: "4px", border: "1px solid #ddd" }}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>
        ))}
        {taskList.length === 0 && <p>No tasks yet.</p>}
      </div>
    </div>
  );
}
