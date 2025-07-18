"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { MdDashboard, MdTask, MdExplore, MdMessage } from "react-icons/md";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { FaRegCalendarAlt, FaUserAlt } from "react-icons/fa";
import Link from "next/link";
import { BellIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface Notification {
  id: string;
  type: "booking" | "message";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export function NotificationBell({ userId }: { userId?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const API_BASE_URL = process.env.NEXT_PUBLIC_TASK_API_URL || 'http://localhost:8084';

  useEffect(() => {
    if (!userId) return;
    const fetchNotifications = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        const res = await fetch(`${API_BASE_URL}/api/notifications?userId=${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const markAllAsRead = async () => {
    if (!userId) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/notifications/mark-all-read?userId=${userId}`,
        {
          method: "PUT",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (!res.ok) throw new Error("Failed to mark all as read");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      alert("Failed to mark all as read");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-violet-600 hover:text-violet-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !n.read ? "bg-violet-50" : ""
                  }`}
                  onClick={() => {}} // Removed markAsRead as per edit hint
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            n.type === "booking"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <p className="font-medium text-sm">{n.title}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(n.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t">
            <Link
              href="/notifications"
              className="block text-center text-sm text-violet-600 hover:text-violet-800"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const [appointmentsOpen, setAppointmentsOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <aside
        className="w-64 min-h-screen p-0 flex flex-col items-stretch bg-white/70 backdrop-blur-lg shadow-xl shadow-gray-200 border-r border-gray-200"
      >
        <div className="px-6 py-8 flex flex-col items-center gap-4 border-b border-gray-100">
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-800">TradeMinutes.</h1>
        </div>
        <nav className="flex-1 flex flex-col gap-2 px-4 py-8">
          <SidebarButton
            href="/dashboard"
            label="Dashboard"
            pathname={pathname}
            icon={<MdDashboard size={22} />}
          />
          <SidebarButton
            href="/tasks/explore"
            label="Explore Services"
            pathname={pathname}
            icon={<MdExplore size={22} />}
          />
          <SidebarButton
            href="/tasks/list"
            label="My Listings"
            pathname={pathname}
            icon={<MdTask size={22} />}
          />
          {/* Collapsible Appointments Menu */}
          <div>
            <button
              className={`flex items-center gap-3 w-full py-2 px-4 rounded-full font-medium transition-colors text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 bg-white/80 ${pathname.startsWith('/appointments') ? 'font-bold' : ''}`}
              style={{ minHeight: 44 }}
              onClick={() => setAppointmentsOpen((open) => !open)}
              aria-expanded={appointmentsOpen}
            >
              <FaRegCalendarAlt size={20} />
              <span className="truncate">My Bookings</span>
              {appointmentsOpen ? <ChevronUpIcon className="w-4 h-4 ml-auto" /> : <ChevronDownIcon className="w-4 h-4 ml-auto" />}
            </button>
            {appointmentsOpen && (
              <div className="ml-8 flex flex-col gap-1 mt-1">
                <SidebarButton
                  href="/appointments/booked-from-me"
                  label="New Bookings"
                  pathname={pathname}
                  icon={<span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" />}
                />
                <SidebarButton
                  href="/appointments/booked-by-me"
                  label="Booked by Me"
                  pathname={pathname}
                  icon={<span className="w-2 h-2 bg-blue-500 rounded-full inline-block" />}
                />
              </div>
            )}
          </div>
          <SidebarButton
            href="/messages"
            label="Messages"
            pathname={pathname}
            icon={<MdMessage size={22} />}
          />
          <SidebarButton
            href="/notifications"
            label="Notifications"
            pathname={pathname}
            icon={<BellIcon className="w-5 h-5" />}
          />
          <SidebarButton
            href="/profile"
            label="My Profile"
            pathname={pathname}
            icon={<FaUserAlt size={20} />}
          />
          <SidebarButton
            href="/settings"
            label="Settings"
            pathname={pathname}
            icon={<FiSettings size={20} />}
          />
        </nav>
      </aside>
    </div>
  );
}

function SidebarButton({
  href,
  label,
  pathname,
  icon,
}: {
  href: string;
  label: string;
  pathname: string;
  icon: React.ReactNode;
}) {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 w-full py-2 px-4 rounded-full font-medium transition-colors text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 ${
        isActive
          ? "bg-emerald-500 text-white shadow-md"
          : "bg-white/80"
      }`}
      style={{ minHeight: 44 }}
    >
      {icon}
      <span className="truncate">{label}</span>
    </Link>
  );
}
