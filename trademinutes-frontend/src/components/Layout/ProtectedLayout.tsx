"use client";

import { useEffect, useState, ReactNode, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../common/Sidebar";
import { NotificationBell } from "../common/Sidebar";
import { useSession } from "next-auth/react";
import { FiPlusCircle } from "react-icons/fi";

interface LayoutProps {
  children: ReactNode;
  headerName?: string;
}

interface RealTimeActivity {
  user: string;
  title: string;
  category: string;
  avatar: string;
  id?: string; // Added id for clickability
}

export default function ProtectedLayout({ children, headerName }: LayoutProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [realTimeActivities, setRealTimeActivities] = useState<RealTimeActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setIsDarkMode(saved === "dark");
  }, [isDarkMode]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Fetch real-time activities
  useEffect(() => {
    const fetchRealTimeActivities = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingActivities(false);
        return;
      }

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_TASK_API_URL || "http://localhost:8084";
        const res = await fetch(`${API_BASE_URL}/api/tasks/get/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        const tasks = json.data || json;
        
        // Transform tasks to activity format
        const activities: RealTimeActivity[] = tasks.slice(0, 10).map((task: any) => ({
          user: task.Author?.Name || 'Anonymous',
          title: task.Title || 'Untitled Task',
          category: task.Category || 'General',
          avatar: task.Author?.Avatar || 'https://images.pexels.com/photos/277576/pexels-photo-277576.jpeg?auto=compress&fit=facearea&w=64&h=64&facepad=2',
          id: task.ID || task.id || task._id // Ensure correct ID is used
        }));
        setRealTimeActivities(activities);
      } catch (err) {
        console.error("Failed to fetch real-time activities:", err);
        // Fallback to mock data if API fails
        setRealTimeActivities([
          { user: "Sarah Kim", title: "Dog Walking", category: "Pet Care", avatar: "https://images.pexels.com/photos/277576/pexels-photo-277576.jpeg?auto=compress&fit=facearea&w=64&h=64&facepad=2", id: "1" },
          { user: "Daniel Ortiz", title: "Math Tutoring", category: "Tutoring", avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&fit=facearea&w=64&h=64&facepad=2", id: "2" },
          { user: "Ayesha Patel", title: "Yoga Session", category: "Fitness", avatar: "https://images.pexels.com/photos/721979/pexels-photo-721979.jpeg?auto=compress&fit=facearea&w=64&h=64&facepad=2", id: "3" },
          { user: "Michael Chen", title: "PC Setup", category: "Tech Help", avatar: "https://images.pexels.com/photos/573570/pexels-photo-573570.jpeg?auto=compress&fit=facearea&w=64&h=64&facepad=2", id: "4" },
          { user: "Emma Davis", title: "House Cleaning", category: "Household Help", avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&fit=facearea&w=64&h=64&facepad=2", id: "5" },
        ]);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchRealTimeActivities();
    
    // Refresh activities every 30 seconds
    const interval = setInterval(fetchRealTimeActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-black min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-6 ">
        <TopBar realTimeActivities={realTimeActivities} loadingActivities={loadingActivities} />
        {children}
      </main>
    </div>
  );
}

// TopBar component for search and profile dropdown
function TopBar({ realTimeActivities, loadingActivities }: { realTimeActivities: RealTimeActivity[], loadingActivities: boolean }) {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";
  const userImage: string | undefined = typeof session?.user?.image === 'string' ? session.user.image : undefined;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  useEffect(() => {
    const fetchUserId = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      if (!token) return setProfileUserId(null);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8080'}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return setProfileUserId(null);
        const profileData = await res.json();
        setProfileUserId(profileData.ID || profileData.id || null);
        setCredits(profileData.Credits ?? profileData.credits ?? null);
      } catch {
        setProfileUserId(null);
      }
    };
    fetchUserId();
  }, []);

  const userId = session?.user?.id;

  return (
    <div className="flex items-center mb-6 gap-8 w-full  bg-white">
      {/* Marquee for real-time service activity (replaces search input) */}
      <div className="w-250 overflow-hidden rounded-full bg-white/80 h-12 flex items-center">
        {loadingActivities ? (
          <div className="flex items-center justify-center w-full">
            <div className="text-sm text-gray-500">Loading activities...</div>
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center animate-marquee whitespace-nowrap">
            {realTimeActivities.concat(realTimeActivities).map((s, i) => {
              console.log("Topbar activity:", s);
              return (
                <span
                  key={i}
                  className="flex items-center gap-2 px-6 text-sm text-gray-700 font-medium cursor-pointer hover:bg-emerald-50 rounded transition"
                  onClick={() => {
                    if (s.id) {
                      window.location.href = `/tasks/view/${s.id}`;
                    }
                  }}
                  title={s.title}
                >
                  <img src={s.avatar} alt={s.user} className="w-7 h-7 rounded-full object-cover border border-gray-200" />
                  <span className="font-semibold text-black">{s.user}</span>
                  added
                  <span className="font-semibold text-emerald-600">{s.title}</span>
                  <span className="text-gray-400">({s.category})</span>
                </span>
              );
            })}
          </div>
        )}
        <style jsx>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 24s linear infinite;
            }
          `}</style>
        </div>
        {/* Right controls: Notification, profile */}
        <div className="flex items-center gap-4 ml-auto">
          {credits !== null && (
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm border border-green-300">
              Credits: {credits}
            </span>
          )}
          <NotificationBell userId={profileUserId || undefined} />
          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-gray-200 shadow-sm hover:bg-emerald-50 transition-colors"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {userImage && userImage !== "" ? (
                <img src={userImage} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <img src="https://static.vecteezy.com/system/resources/thumbnails/027/951/137/small_2x/stylish-spectacles-guy-3d-avatar-character-illustrations-png.png" alt="default avatar" className="w-8 h-8 rounded-full object-cover" />
              )}
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50">Profile</a>
                <a href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-emerald-50">Settings</a>
                <button type="button" onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }