"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  taskTitle?: string;
  taskId?: string;
}

interface TaskOwner {
  id: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [taskTitles, setTaskTitles] = useState<Record<string, string>>({});
  const [taskOwners, setTaskOwners] = useState<Record<string, string>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      if (!token) return;
      try {
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8084'}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setCurrentUserId(profileData.ID || profileData.id);
        }
      } catch {}
    };
    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        // Get userId from profile API (same as TopBar)
        let userId = null;
        if (token) {
          const profileRes = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8084'}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            userId = profileData.ID || profileData.id;
          }
        }
        if (!userId) throw new Error("User ID not found");
        const API_BASE_URL = process.env.NEXT_PUBLIC_TASK_API_URL || 'http://localhost:8084';
        const res = await fetch(`${API_BASE_URL}/api/notifications?userId=${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
        setError(null);
        // Fetch task titles and owners for notifications that have a taskId
        const taskIdToFetch = data
          .filter((n: Notification) => n.taskId && !n.taskTitle)
          .map((n: Notification) => n.taskId);
        if (taskIdToFetch.length > 0) {
          const token = localStorage.getItem("token");
          const API_BASE_URL = process.env.NEXT_PUBLIC_TASK_API_URL || 'http://localhost:8084';
          const fetchTitlesAndOwners = async () => {
            const titles: Record<string, string> = {};
            const owners: Record<string, string> = {};
            await Promise.all(taskIdToFetch.map(async (taskId: string) => {
              try {
                const res = await fetch(`${API_BASE_URL}/api/tasks/get/${taskId}`, {
                  headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (res.ok) {
                  const task = await res.json();
                  titles[taskId] = task.Title || task.title || "(No title)";
                  owners[taskId] = task.Author?.ID || task.Author?.id || task.author?.id || "";
                }
              } catch {}
            }));
            setTaskTitles(titles);
            setTaskOwners(owners);
          };
          fetchTitlesAndOwners();
        }
      } catch (err: any) {
        setError(err.message || "Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Helper to get taskId as string
  const getTaskIdString = (taskId: any) => {
    if (!taskId) return undefined;
    if (typeof taskId === "string") return taskId;
    if (typeof taskId === "object" && "$oid" in taskId) return taskId["$oid"];
    return undefined;
  };

  return (
    <ProtectedLayout headerName="Notifications">
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-xl shadow border border-gray-200">
        <h1 className="text-2xl font-bold mb-6">All Notifications</h1>
        {loading ? (
          <div className="text-gray-500">Loading notifications...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="text-gray-500">No notifications found.</div>
        ) : (
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-1 bg-gray-200 rounded-full" style={{ zIndex: 0 }} />
            <ul className="space-y-8">
              {notifications.map((n, idx) => {
                const taskIdStr = getTaskIdString(n.taskId);
                const isOwner = currentUserId && taskIdStr && taskOwners[taskIdStr] && currentUserId === taskOwners[taskIdStr];
                return (
                <li key={n.id} className={`relative flex items-start gap-4 ${!n.read ? 'bg-violet-50' : ''} rounded-lg p-3 transition`}> 
                  {/* Timeline dot */}
                  <span className={`z-10 mt-2 w-4 h-4 rounded-full border-4 ${n.type === "booking" ? "bg-green-500 border-green-200" : n.type === "booking_accepted" ? "bg-blue-500 border-blue-200" : "bg-gray-400 border-gray-200"}`}></span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{n.title}</span>
                      {!n.read && <span className="ml-2 px-2 py-0.5 text-xs rounded bg-emerald-100 text-emerald-700 font-medium">New</span>}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">{n.message}</div>
                      {/* Show task info if available or loading */}
                      {taskIdStr && (
                        <div className="text-xs text-emerald-700 mt-1">
                          Task: <span className="font-semibold">{taskTitles[taskIdStr] || "Loading..."}</span>
                          {n.type === "booking" ? (
                            <a href="/appointments/booked-from-me" className="ml-2 text-blue-600 underline hover:text-blue-800">View Task</a>
                          ) : (
                            <a href="/appointments/booked-by-me" className="ml-2 text-blue-600 underline hover:text-blue-800">View Task</a>
                          )}
                        </div>
                      )}
                    <div className="text-xs text-gray-400 mt-1">{new Date(n.timestamp * 1000).toLocaleString()}</div>
                  </div>
                </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
} 