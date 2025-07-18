"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import CreateListingModal from "../CreateTaskModal";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface Availability {
  Date: string;
  TimeFrom: string;
  TimeTo: string;
}

interface Author {
  id: string;
  Name: string;
  Email: string;
}

interface Task {
  id: string;
  Title: string;
  Description: string;
  Location: string;
  Latitude: number;
  longitude: number;
  LocationType: string;
  Credits: number;
  Availability: Availability[];
  Type?: string;
  Status?: string;
  Author?: Author;
}

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const router = useRouter();

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_TASK_API_URL || "http://localhost:8084";
      const res = await fetch(`${API_BASE_URL}/api/tasks/get/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const json = await res.json();
      if (json && Array.isArray(json.data)) {
        setTasks(json.data.map((task: any) => ({ ...task, id: task.id || task._id })));
      } else if (Array.isArray(json)) {
        setTasks(json.map((task: any) => ({ ...task, id: task.id || task._id })));
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    if (!taskToDelete || !token) return;

    try {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_TASK_API_URL || "http://localhost:8084";

      const res = await fetch(
        `${API_BASE_URL}/api/tasks/delete/${taskToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        toast.error("❌ Failed to delete task");
        return;
      }

      toast.success("🗑️ Task deleted");
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskToDelete)
      );
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("❌ Network error");
    } finally {
      setShowConfirmModal(false);
      setTaskToDelete(null);
    }
  };

  console.log("task", tasks);

  // Force mapping of _id to id before rendering
  const mappedTasks = tasks.map((task: any) => ({ ...task, id: task.id }));

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-white p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Listings</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow hover:scale-105 transition"
          >
            ➕ Create Listing
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : mappedTasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mappedTasks.map((task: Task, idx: number) => {
              // Colorful border palette
              const borderColors = [
                'border-green-400',
                'border-blue-400',
                'border-pink-400',
                'border-yellow-400',
                'border-purple-400',
                'border-orange-400',
              ];
              const borderClass = borderColors[idx % borderColors.length];
              return (
                <div
                  key={task.id ?? idx}
                  className={`bg-white rounded-lg p-5 shadow-md hover:shadow-xl relative border-2 ${borderClass} transition cursor-pointer`}
                  onClick={() => router.push(`/tasks/view/${String(task.id)}`)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setTaskToDelete(task.id);
                      setShowConfirmModal(true);
                    }}
                    className="absolute top-3 right-4 text-lg text-red-500 hover:text-red-700 font-bold"
                    title="Delete"
                  >
                    ×
                  </button>
                  <h3 className="text-lg font-semibold mb-1">{task.Title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{task.Description}</p>
                  <p className="text-xs text-gray-500 mb-1">
                    📍 <strong>{task.Location}</strong> ({task.LocationType})
                  </p>
                  {task.Availability?.length > 0 && (
                    <p className="text-xs text-gray-500 mb-1">
                      📅 {task.Availability[0].Date} — ⏰ {task.Availability[0].TimeFrom} to {task.Availability[0].TimeTo}
                    </p>
                  )}
                  <p className="text-sm font-medium text-gray-700">
                    🪙 {task.Credits} credits
                  </p>
                  {task.Author && (
                    <p className="text-xs text-gray-500 mt-1">
                      👤 Listed by <strong>{task.Author.Name}</strong> ({task.Author.Email})
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
            <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
              <p className="text-sm text-gray-600 mb-6">
                This will permanently delete the task.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { console.log('Delete clicked', taskToDelete); handleDelete(); }}
                  className="px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <CreateListingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          showToast={(msg, type) =>
            type === "success" ? toast.success(msg) : toast.error(msg)
          }
          onCreated={fetchTasks}
        />

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </ProtectedLayout>
  );
}
