"use client";

import { useState } from "react";

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 20,
};

const modalCard: React.CSSProperties = {
  width: "420px",
  background: "#ffffff",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: "0 24px 60px rgba(15, 23, 42, 0.2)",
};

const modalTitle: React.CSSProperties = {
  margin: "0 0 20px",
  color: "#1f2a44",
};

const fieldLabel: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  marginTop: "14px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#536179",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #d6e0ec",
  outline: "none",
  fontSize: "15px",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: "90px",
  resize: "vertical",
};

const modalActions: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "22px",
};

const cancelButton: React.CSSProperties = {
  padding: "11px 16px",
  borderRadius: "10px",
  border: "1px solid #d6e0ec",
  background: "#ffffff",
  color: "#536179",
  cursor: "pointer",
};

const saveButton: React.CSSProperties = {
  padding: "11px 18px",
  borderRadius: "10px",
  border: "none",
  background: "#2f80d7",
  color: "#ffffff",
  fontWeight: 700,
  cursor: "pointer",
};

type Priority = "low" | "medium" | "urgent" | "";

type Task = {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  completed: boolean;
};

type CreateTaskModalProps = {
  onClose: () => void;
  onCreateTask: (task: Task) => void;
};

export default function CreateTaskModal({
  onClose,
  onCreateTask,
}: CreateTaskModalProps) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "" as Priority,
    dueDate: "",
  });

  const handleCreateTask = () => {
    if (!newTask.title.trim()) {
      alert("Task title is required");
      return;
    }

    const task: Task = {
      id: Date.now(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      completed: false,
    };

    onCreateTask(task);
    onClose();
  };

  return (
    <div style={modalOverlay}>
      <div style={modalCard}>
        <h2 style={modalTitle}>Create New Task</h2>

        <label style={fieldLabel}>Title *</label>
        <input
          style={inputStyle}
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Enter task title"
        />

        <label style={fieldLabel}>Description</label>
        <textarea
          style={textareaStyle}
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          placeholder="Add a short description"
        />

        <label style={fieldLabel}>Priority</label>
        <select
          style={inputStyle}
          value={newTask.priority}
          onChange={(e) =>
            setNewTask({ ...newTask, priority: e.target.value as Priority })
          }
        >
          <option value="">Select priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="urgent">Urgent</option>
        </select>

        <label style={fieldLabel}>Due Date</label>
        <input
          style={inputStyle}
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />

        <div style={modalActions}>
          <button style={cancelButton} onClick={onClose}>
            Cancel
          </button>

          <button style={saveButton} onClick={handleCreateTask}>
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}