"use client"

import React, { useEffect, useState } from 'react';
import SideBar from "@/components/SideBar";
import CreateTaskModal from "@/components/CreateTaskModal";
import { useRouter } from "next/navigation";
import { User, Bell } from "lucide-react";

type Priority = "LOW" | "MEDIUM" | "URGENT" | "";

type Task = {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  dueDate: string | null;
  done: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  border: "1px solid #2f80d7",
  background: "#ffffff",
  color: "#2f80d7",
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
  position: "relative",
};

const dashboardContent: React.CSSProperties = {
  padding: "32px",
};

const createTaskButton: React.CSSProperties = {
  position: "absolute",
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
    priority === "URGENT"
      ? "#ffe1e1"
      : priority === "MEDIUM"
      ? "#fff1c7"
      : "#dff7e8",
  color:
    priority === "URGENT"
      ? "#c92a2a"
      : priority === "MEDIUM"
      ? "#9a6700"
      : "#1f7a43",
});

const emptyState: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "60px",
  textAlign: "center",
};

const emptyImage: React.CSSProperties = {
  width: "320px",
  maxWidth: "100%",
};

const emptyText: React.CSSProperties = {
  marginTop: "20px",
  fontSize: "18px",
  color: "#64748b",
  fontWeight: 500,
};

export default function Home() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [studentName, setStudentName] = useState("");
    const router = useRouter();

    useEffect(() => {
      const fetchTasks = async () => {
        try {
          const response = await fetch("/api/tasks", {
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Failed to load tasks");
          }

          const data = await response.json();
          setTasks(data);

          const userResponse = await fetch("/api/auth/me", {
            credentials: "include",
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setStudentName(userData.name);
          }
        } catch (error) {
          setError("Could not load tasks");
        } finally {
          setIsLoading(false);
        }
      };

      fetchTasks();
    }, []);

    const toggleTaskStatus = async (taskId: string, currentDone: boolean) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          done: !currentDone,
        }),
      });

      if (!response.ok) {
        alert("Could not update task");
        return;
      }

      const updatedTask = await response.json();

      setTasks(
        tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        )
      );
    };

    return (
    <div style={appLayout}>
        <SideBar studentName={studentName} />

        <main style={mainArea}>
        <header style={topBar}>
            <div>
            <p style={greeting}>Welcome Aboard</p>
            <h1 style={pageTitle}> {studentName || "Student"} </h1>
            </div>

            <div style={topBarActions}>
            <button style={iconButton} aria-label="Notifications">
              <Bell size={20} />
            </button>

            <button
              style={{
                ...topAvatar,
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => router.push("/dashboard/profile")}
            >
              <User size={20} />
            </button>
            </div>
        </header>

        <section style={dashboardContent}>
            <h1 className="text-3xl font-bold mb-10 text-[#2F80D1]">
            Dashboard
            </h1>

            {tasks.length === 0 ? (
              <div style={emptyState}>
                <img
                  src="/empty-state.svg"
                  alt="No tasks"
                  style={emptyImage}
                />

                <p style={emptyText}>
                  No tasks yet. Click the + button to create one.
                </p>
              </div>
            ) : (
              <div style={taskList}>
                {tasks.map((task) => (
                <div key={task.id} style={taskCard}>
                <div>
                    <p
                      style={{
                        ...taskTitle,
                        textDecoration: task.done ? "line-through" : "none",
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
                  onClick={() => toggleTaskStatus(task.id, task.done)}
                >
                  {task.done ? "Mark Incomplete" : "Mark Complete"}
                </button>
                </div>
            ))}
            </div>
          )}
            <button style={createTaskButton} onClick={() => setShowModal(true)}>
            +
            </button>

            {showModal && (
            <CreateTaskModal
                onClose={() => setShowModal(false)}
                onCreateTask={(createdTask) => setTasks([createdTask, ...tasks])}
            />
            )}
        </section>
        </main>
    </div>
    );
};