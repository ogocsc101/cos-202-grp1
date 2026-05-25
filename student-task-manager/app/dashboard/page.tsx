"use client"

import React, { useEffect, useState } from 'react';
import SideBar from "@/components/SideBar";
import CreateTaskModal from "@/components/CreateTaskModal";
import { useRouter } from "next/navigation";
import { User, Bell, Check, Trash2 } from "lucide-react";
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

const topBarActions: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
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
  transition: "all 0.25s ease",
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
  position: "fixed",
  bottom: "28px",
  left: "50%",
  transform: "translateX(-50%)",
  right: "28px",
  background: "#2f80d7",
  color: "#fff",
  border: "none",
  zIndex: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
};

const taskList: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  maxWidth: "900px",
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

type TaskItemProps = {
  task: Task;
  toggleTaskStatus: (id: string, done: boolean) => void;
  formatDate: (date: string) => string;
  deleteTask: (id: string) => void;
  onEdit: (task: Task) => void;
};

const TaskItem = ({ task, toggleTaskStatus, formatDate, deleteTask, onEdit, }: TaskItemProps) => {
  return (
    <motion.div
      layout
      layoutId={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: task.done ? 0.98 : 1,
      }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ duration: 0.35 }}
    >
      <div
        className={`
          flex items-center justify-between
          rounded-xl p-4
          transition-all duration-300
          ${task.done ? "bg-blue-100" : "bg-[#eaf4ff]"}
        `}
      >
        <div className="flex items-start gap-4">

          {/* CHECK BUTTON */}
          <button
            onClick={() => toggleTaskStatus(task.id, task.done)}
            className={`
              w-7 h-7 rounded-full border-2
              flex items-center justify-center
              transition-all duration-300 mt-1
              ${
                task.done
                  ? "bg-[#2f80d7] border-[#2f80d7]"
                  : "border-[#2f80d7]"
              }
            `}
          >
            {task.done && <Check size={16} color="white" />}
          </button>

          {/* TASK CONTENT */}
          <div>
            <p
              className={`
                text-[16px]
                font-bold
                ${
                  task.done
                    ? "line-through text-slate-500"
                    : "text-[#1f2a44]"
                }
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

            {task.priority && (
              <span style={priorityBadge(task.priority)}>
                {task.priority}
              </span>
            )}

            <div className="flex gap-3 mt-4">

              <button
                onClick={() => onEdit(task)}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 transition"
              >
                <Trash2 size={18} />
              </button>

            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
    const [studentName, setStudentName] = useState("");
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const handleEdit = (task: Task) => {
      setEditingTask(task);
      setShowModal(true);
    };
    const formatDate = (date: string) => {
      const d = new Date(date);
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };
    const activeTasks = tasks.filter(t => !t.done);
    const completedTasks = tasks.filter(t => t.done);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("asc");
    const deleteTask = async (taskId: string) => {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        alert("Could not delete task");
        return;
      }

      setTasks(prev => prev.filter(task => task.id !== taskId));
    };

    useEffect(() => {
      const fetchTasks = async () => {
        try {
          const response = await fetch(
            `/api/tasks?search=${search}&sortBy=${sortBy}&order=${order}`,
            {
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to load tasks");
          }

          const data = await response.json();
          setTasks(data);

          const userResponse = await fetch("/api/auth/me", {
            credentials: "include",
          });

          if (!userResponse.ok) {
            console.log("Failed to fetch user");
            return;
          }
          
          const userData = await userResponse.json();
          console.log("USER DATA:", userData);

          setStudentName(
            userData?.name ||
            userData?.user?.name ||
            ""
          );

        } catch (error) {
          setError("Could not load tasks");
        }
        finally {
          setIsLoading(false);
        }
      };

      fetchTasks();
    }, [search, sortBy, order]);

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

      setTasks(prev =>
        prev.map(task =>
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
            </div>

            <div style={topBarActions}>
            <button style={iconButton} className="hover:bg-[#2f80d7] hover:text-white">
              <Bell size={20} />
            </button>

            <button
              style={iconButton}
              className="hover:bg-blue-600 hover:text-white"
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

            <div className="flex flex-wrap gap-4 mb-10">

              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  px-4 py-3
                  rounded-xl
                  border border-blue-100
                  outline-none
                  bg-white
                  min-w-[260px]
                "
              />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="
                  px-4 py-3
                  rounded-xl
                  border border-blue-100
                  bg-white
                "
              >
                <option value="createdAt">Created</option>
                <option value="priority">Priority</option>
                <option value="dueDate">Due Date</option>
              </select>

              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="
                  px-4 py-3
                  rounded-xl
                  border border-blue-100
                  bg-white
                "
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>

            </div>

            {isLoading ? (
              <p>Loading...</p>
            ) : activeTasks.length === 0 && completedTasks.length === 0 ? (
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
              <div className="space-y-10">

                {/* ACTIVE TASKS */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-xl font-bold text-slate-700">
                      Active Tasks
                    </h2>

                    <div className="h-[2px] flex-1 bg-blue-100 rounded-full" />
                  </div>

                  <div style={taskList}>
                    <AnimatePresence>
                      {activeTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          toggleTaskStatus={toggleTaskStatus}
                          formatDate={formatDate}
                          deleteTask={deleteTask}
                          onEdit={handleEdit}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* COMPLETED TASKS */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <h2 className="text-lg font-semibold text-slate-700">
                      Completed
                    </h2>
                    <div className="h-[2px] flex-1 bg-blue-100 rounded-full" />
                  </div>

                    <div style={taskList}>
                      <AnimatePresence>
                        {completedTasks.map((task) => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            toggleTaskStatus={toggleTaskStatus}
                            formatDate={formatDate}
                            deleteTask={deleteTask}
                            onEdit={handleEdit}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                </div>
              </div>
            )}
            <button
              style={createTaskButton}
              onClick={() => {
                setEditingTask(null);
                setShowModal(true);
              }}
              className="
                group
                w-16 h-16
                hover:w-[190px]
                rounded-full
                hover:rounded-2xl
                transition-all
                duration-300
                flex
                items-center
                justify-center
                gap-2
              "           
            >
              <span className="text-3xl leading-none">+</span>

              <span
                className="
                  max-w-0
                  opacity-0
                  overflow-hidden
                  group-hover:max-w-[120px]
                  group-hover:opacity-100
                  transition-all
                  duration-300
                  whitespace-nowrap
                  text-lg
                  font-semibold
                "
              >
                Add Task
              </span>
            </button>
        </section>
        {showModal && (
          <CreateTaskModal
            task={editingTask}
            onClose={() => {
              setShowModal(false);
              setEditingTask(null);
            }}
            onCreateTask={(task) => {
              setTasks((prev) => [task, ...prev]);
            }}
          />
        )}
      </main>
    </div>
  );
}