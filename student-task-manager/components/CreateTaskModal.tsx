"use client";

import { useState, useEffect } from "react";

type Priority = "LOW" | "MEDIUM" | "URGENT";

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: Exclude<Priority, "">;
  dueDate: string | null;
  done: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type CreateTaskModalProps = {
  onClose: () => void;
  onCreateTask: (task: Task) => void;
  task?: Task | null;
};

const modalOverlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(15, 23, 42, 0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100,
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

export default function CreateTaskModal({
  onClose,
  onCreateTask,
  task,
}: CreateTaskModalProps) {
  const isEditMode = !!task;

  const [newTask, setNewTask] = useState<{
    title: string;
    description:string;
    priority: Priority;
    dueDate: string;
  }>({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
  });

    const handleSubmit = async () => {
      if (!newTask.title.trim()) {
        alert("Task title is required");
        return;
      }

      const payload = {
        title: newTask.title,
        description: newTask.description || null,
        priority: newTask.priority,
        dueDate: newTask.dueDate
          ? new Date(newTask.dueDate).toISOString()
          : null,
      };

      let response;

      if (isEditMode && task) {
        // ✏️ EDIT MODE
        response = await fetch(`/api/tasks/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } else {
        // ➕ CREATE MODE
        response = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      onCreateTask(data);
      onClose();
    };

    useEffect(() => {
      if (task) {
        setNewTask({
          title: task.title,
          description: task.description || "",
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        });
      }
    }, [task]);

  return (
    <div style={modalOverlay}>
      <div style={modalCard}>
        <h2>{isEditMode ? "Edit Task" : "Create New Task"}</h2>

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
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="URGENT">Urgent</option>
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

          <button style={saveButton} onClick={handleSubmit}>
            {isEditMode ? "Update Task" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}