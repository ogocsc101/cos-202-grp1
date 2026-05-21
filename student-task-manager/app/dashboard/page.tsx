"use client"

import React, { useState } from 'react';
import SideBar from "@/components/SideBar";
import CreateTaskModal from "@/components/CreateTaskModal";

type Priority = "low" | "medium" | "urgent" | "";

type Task = {
id: number;
title: string;
description: string;
priority: Priority;
dueDate: string;
completed: boolean;
};

const topBar: React.CSSProperties = {
  height: "88px",
  background: "#ffffff",
  borderBottom: "1px solid #e5edf7",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 32px",
};

const greeting: React.CSSProperties = {
  margin: 0,
  fontSize: "14px",
  color: "#7a8799",
  fontWeight: 600,
};

const pageTitle: React.CSSProperties = {
  margin: "4px 0 0",
  fontSize: "28px",
  color: "#1f2a44",
};

const topBarActions: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const iconButton: React.CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  border: "1px solid #e5edf7",
  background: "#ffffff",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  fontSize: "18px",
};

const topAvatar: React.CSSProperties = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "#2f80d7",
  color: "#ffffff",
  display: "grid",
  placeItems: "center",
  fontWeight: 700,
};

const appLayout: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  background: "#f3f7fc",
};

const mainArea: React.CSSProperties = {
  flex: 1,
  minHeight: "100vh",
};

const dashboardContent: React.CSSProperties = {
  padding: "32px",
};

const createTaskButton: React.CSSProperties = {
  position: "fixed",
  bottom: "28px",
  left: "50%",
  transform: "translateX(-50%)",
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  border: "none",
  background: "#2f80d7",
  color: "#ffffff",
  fontSize: "34px",
  fontWeight: 500,
  cursor: "pointer",
  boxShadow: "0 14px 30px rgba(47, 128, 215, 0.35)",
};

const taskList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  maxWidth: "900px",
};

const taskCard: React.CSSProperties = {
  background: "#eaf4ff",
  borderRadius: "12px",
  padding: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const taskTitle: React.CSSProperties = {
  margin: 0,
  fontSize: "16px",
  fontWeight: 700,
  color: "#1f2a44",
};

const taskDescription: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: "14px",
  color: "#64748b",
};

const taskDueDate: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: "14px",
  color: "#111827",
};

const taskActionButton: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "#2f80d7",
  fontWeight: 700,
  cursor: "pointer",
};

const priorityBadge = (priority: Priority): React.CSSProperties => ({
  display: "inline-block",
  marginTop: "8px",
  padding: "4px 9px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "capitalize",
  background:
    priority === "urgent"
      ? "#ffe1e1"
      : priority === "medium"
      ? "#fff1c7"
      : "#dff7e8",
  color:
    priority === "urgent"
      ? "#c92a2a"
      : priority === "medium"
      ? "#9a6700"
      : "#1f7a43",
});

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([
      {
        id: 1,
        title: "Complete homework",
        description: "",
        priority: "medium",
        dueDate: "2023-10-01",
        completed: false,
      },
    ]);
    
    const [showModal, setShowModal] = useState(false);

    const toggleTaskStatus = (taskId: number) => {
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    };

    return (
    <div style={appLayout}>
        <SideBar />

        <main style={mainArea}>
        <header style={topBar}>
            <div>
            <p style={greeting}>Welcome Aboard</p>
            <h1 style={pageTitle}> [Student_Name] </h1>
            </div>

            <div style={topBarActions}>
            <button style={iconButton} aria-label="Notifications">
                🔔
            </button>

            <div style={topAvatar}>N</div>
            </div>
        </header>

        <section style={dashboardContent}>
            <h1 className="text-3xl font-bold mb-10 text-[#2F80D1]">
            Dashboard
            </h1>

            <div style={taskList}>
            {tasks.map((task) => (
                <div key={task.id} style={taskCard}>
                <div>
                    <p
                    style={{
                        ...taskTitle,
                        textDecoration: task.completed ? "line-through" : "none",
                    }}
                    >
                    {task.title}
                    </p>

                    {task.description && (
                    <p style={taskDescription}>{task.description}</p>
                    )}

                    {task.dueDate && (
                    <p style={taskDueDate}>Due: {task.dueDate}</p>
                    )}

                    {task.priority && (
                    <span style={priorityBadge(task.priority)}>
                        {task.priority}
                    </span>
                    )}
                </div>

                <button
                    style={taskActionButton}
                    onClick={() => toggleTaskStatus(task.id)}
                >
                    {task.completed ? "Mark Incomplete" : "Mark Complete"}
                </button>
                </div>
            ))}
            </div>

            <button style={createTaskButton} onClick={() => setShowModal(true)}>
            +
            </button>

            {showModal && (
            <CreateTaskModal
                onClose={() => setShowModal(false)}
                onCreateTask={(task: Task) => setTasks([task, ...tasks])}
            />
            )}
        </section>
        </main>
    </div>
    );
};