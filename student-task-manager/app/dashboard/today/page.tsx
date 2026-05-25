"use client";

import React, { useEffect, useState } from "react";
import SideBar from "@/components/SideBar";
import { Check, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Priority = "LOW" | "MEDIUM" | "URGENT";

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

const appLayout: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  background: "#f3f7fc",
};

const mainArea: React.CSSProperties = {
  flex: 1,
  minHeight: "100vh",
  position: "relative",
  marginLeft: "240px",
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
  fontSize: "20px",
  color: "#7a8799",
  fontWeight: 600,
};

const content: React.CSSProperties = {
  padding: "32px",
  minHeight: "calc(100vh - 88px)",
  background: "#f8fbff",
};

const taskList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  maxWidth: "900px",
};

const emptyState: React.CSSProperties = {
  marginTop: "70px",
  textAlign: "center",
  color: "#64748b",
  fontSize: "18px",
  fontWeight: 500,
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

const isToday = (date: string | null) => {
  if (!date) return false;

  const taskDate = new Date(date);
  const today = new Date();

  return (
    taskDate.getFullYear() === today.getFullYear() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getDate() === today.getDate()
  );
};

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
};

type TaskItemProps = {
  task: Task;
  toggleTaskStatus: (id: string, done: boolean) => void;
  deleteTask: (id: string) => void;
};

function TaskItem({ task, toggleTaskStatus, deleteTask }: TaskItemProps) {
  return (
    <motion.div
      layout
      layoutId={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, scale: task.done ? 0.98 : 1 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.35 }}
    >
      <div
        className={`
          flex items-center justify-between gap-4
          rounded-xl p-4
          transition-all duration-300
          ${task.done ? "bg-blue-100" : "bg-[#eaf4ff]"}
        `}
      >
        <div className="flex items-start gap-4 min-w-0">
          <button
            onClick={() => toggleTaskStatus(task.id, task.done)}
            className={`
              w-7 h-7 rounded-full border-2
              flex items-center justify-center
              transition-all duration-300 mt-1
              shrink-0
              ${
                task.done
                  ? "bg-[#2f80d7] border-[#2f80d7]"
                  : "border-[#2f80d7]"
              }
            `}
          >
            {task.done && <Check size={16} color="white" />}
          </button>

          <div className="min-w-0">
            <p
              className={`
                text-[16px] font-bold
                ${task.done ? "line-through text-slate-500" : "text-[#1f2a44]"}
              `}
            >
              {task.title}
            </p>

            {task.description && (
              <p className="text-sm text-slate-500 mt-1">
                {task.description}
              </p>
            )}

            {task.dueDate && (
              <p className="text-sm text-gray-700 mt-1">
                Due: {formatDate(task.dueDate)}
              </p>
            )}

            <span style={priorityBadge(task.priority)}>{task.priority}</span>
          </div>
        </div>

        <button
          onClick={() => deleteTask(task.id)}
          className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-700 transition shrink-0"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}

export default function TodayPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const todayTasks = tasks.filter((task) => isToday(task.dueDate));

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
      } catch (error) {
        console.log("Could not load today's tasks", error);
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

    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? updatedTask : task))
    );
  };

  const deleteTask = async (taskId: string) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      alert("Could not delete task");
      return;
    }

    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <div style={appLayout}>
      <SideBar />

      <main style={mainArea}>
        <header style={topBar}>
          <p style={greeting}>Tasks Due Today</p>
        </header>

        <section style={content}>
          <h1 className="text-3xl font-bold mb-10 text-[#2F80D1]">
            Today
          </h1>

          {isLoading ? (
            <p>Loading...</p>
          ) : todayTasks.length === 0 ? (
            <div style={emptyState}>
              No tasks are due today.
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-xl font-bold text-slate-700">
                  Due Today
                </h2>
                <div className="h-[2px] flex-1 bg-blue-100 rounded-full" />
              </div>

              <div style={taskList}>
                <AnimatePresence>
                  {todayTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      toggleTaskStatus={toggleTaskStatus}
                      deleteTask={deleteTask}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}