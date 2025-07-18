"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";
import { FaTasks, FaListAlt, FaBook, FaHashtag } from "react-icons/fa";

const Map = dynamic(() => import("@/components/OpenStreetMap"), { ssr: false });

// ─── added modal-related helper component ──────────────────────────────────────
function SkillTagInput({
  tags,
  setTags,
}: {
  tags: string[];
  setTags: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div>
      <label className="text-sm font-medium block mb-1">
        Skills &amp; Interests
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-violet-100 text-violet-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="text-red-500 font-bold leading-none"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          placeholder="e.g. #Python"
          className="flex-1 px-3 py-2 border rounded bg-white text-black"
        />
        <button
          onClick={addTag}
          className="bg-violet-600 text-white px-3 py-2 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────

// Define Task type for taskStats
type Task = {
  Title?: string;
  title?: string;
  Credits?: number;
  credits?: number;
};

export default function ProfileDashboardPage() {
  const [profile, setProfile] = useState<{
    Name: string;
    Email: string;
    university?: string;
    program?: string;
    yearOfStudy?: string;
    skills?: string[];
    Credits?: number; // Added Credits to profile type
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ─── new state for modal steps ──────────────────────────────────────────────
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileStep, setProfileStep] = useState(1);
  const [formError, setFormError] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const [formData, setFormData] = useState({
    university: "",
    program: "",
    yearOfStudy: "",
    skills: [] as string[],
  });
  const [skillInput, setSkillInput] = useState("");

  const [showCreditsDialog, setShowCreditsDialog] = useState(false);
  const [showBonusDialog, setShowBonusDialog] = useState(false);
  const [creditsBefore, setCreditsBefore] = useState<number | null>(null);
  const [creditsAfter, setCreditsAfter] = useState<number | null>(null);

  const API_BASE =
    process.env.NEXT_PUBLIC_PROFILE_API_URL || "http://localhost:8081";

  const updateProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token");

    const res = await fetch(`${API_BASE}/api/profile/update-info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        college: formData.university,
        program: formData.program,
        yearOfStudy: formData.yearOfStudy,
        skills: formData.skills,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Update failed");
    }
  };

  // ────────────────────────────────────────────────────────────────────────────

  const router = useRouter();

  // --- Analytics state ---
  const [taskStats, setTaskStats] = useState<{ total: number; credits: number; recent: Task[] }>({ total: 0, credits: 0, recent: [] });
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("❌ No token found — redirecting");
      router.push("/login");
      return;
    }

    console.log("✅ JWT token loaded from localStorage:", token);

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PROFILE_API_URL}/api/profile/get`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const rawText = await res.text();
          throw new Error(rawText || "Invalid response format");
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unauthorized");

        // Detailed debug logging
        console.log("=== Profile Data Debug ===");
        console.log("Raw profile data:", JSON.stringify(data, null, 2));

        // Handle case-sensitive field names from API
        const profileData = {
          university:
            data.university ||
            data.University ||
            data.college ||
            data.College ||
            "",
          program:
            data.program || data.Program || data.major || data.Major || "",
          yearOfStudy:
            data.yearOfStudy ||
            data.YearOfStudy ||
            data.year ||
            data.Year ||
            "",
        };

        // Check if the fields exist and are not empty strings
        const hasUniversity =
          profileData.university && profileData.university.trim() !== "";
        const hasProgram =
          profileData.program && profileData.program.trim() !== "";
        const hasYearOfStudy =
          profileData.yearOfStudy && profileData.yearOfStudy.trim() !== "";

        console.log("Processed field values:", profileData);

        console.log("Field status:", {
          hasUniversity,
          hasProgram,
          hasYearOfStudy,
        });

        setProfile({
          ...data,
          university: profileData.university,
          program: profileData.program,
          yearOfStudy: profileData.yearOfStudy,
          skills: Array.isArray(data.skills) && data.skills.length > 0
            ? data.skills
            : Array.isArray(data.Skills)
              ? data.Skills
              : [],
        });

        // Only show dialog if any required field is missing or empty
        if (!hasUniversity || !hasProgram || !hasYearOfStudy) {
          console.log("Showing profile dialog - Missing fields detected");
          setShowProfileDialog(true);
          setFormData((prev) => ({
            ...prev,
            university: profileData.university.trim(),
            program: profileData.program.trim(),
            yearOfStudy: profileData.yearOfStudy.trim(),
            skills: Array.isArray(data.skills) ? data.skills : [],
          }));
        } else {
          console.log("All fields present - Not showing dialog");
          setShowProfileDialog(false);
        }
      } catch (error) {
        console.error("❌ Profile fetch error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Fetch tasks
    fetch(`${process.env.NEXT_PUBLIC_TASK_API_URL || "http://localhost:8084"}/api/tasks/get/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(json => {
        let tasks: Task[] = [];
        if (json && Array.isArray(json.data)) {
          tasks = json.data;
        } else if (Array.isArray(json)) {
          tasks = json;
        }
        setTaskStats({
          total: tasks.length,
          credits: tasks.reduce((sum: number, t: Task) => sum + (t.Credits || 0), 0),
          recent: tasks.slice(0, 5),
        });
      });

    // Fetch upcoming appointments (realtime)
    let interval: NodeJS.Timeout;
    const fetchAppointments = async () => {
      try {
        // Get user ID from profile
        let userId;
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8081'}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) return;
        const profileData = await profileRes.json();
        userId = profileData.ID || profileData.id;
        if (!userId) return;
        // Use the same API as the appointments page
        const res = await fetch(`${process.env.NEXT_PUBLIC_TASK_API_URL || "http://localhost:8084"}/api/bookings?role=owner&id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const json = await res.json();
        const bookings = (json.data || json || []);
        // For each booking, fetch task details if needed
        const API_BASE_URL = process.env.NEXT_PUBLIC_TASK_API_URL || "http://localhost:8084";
        const tokenHeader = { Authorization: `Bearer ${token}` };
        const appointmentsWithTasks = await Promise.all(bookings.slice(0, 5).map(async (item: any, idx: number) => {
          let title = "(No title)";
          let dateStr = item.Timeslot?.date || null;
          let from = item.Timeslot?.timeFrom || null;
          let to = item.Timeslot?.timeTo || null;
          if (item.TaskID) {
            try {
              const taskRes = await fetch(`${API_BASE_URL}/api/tasks/get/${item.TaskID}`, { headers: tokenHeader });
              if (taskRes.ok) {
                const taskData = await taskRes.json();
                title = taskData.Title || taskData.title || title;
                // Fallback: If booking is missing date/time, use task availability[0]
                if (!dateStr || !from || !to) {
                  dateStr = taskData.Availability?.[0]?.Date || null;
                  from = taskData.Availability?.[0]?.TimeFrom || null;
                  to = taskData.Availability?.[0]?.TimeTo || null;
                }
              }
            } catch {}
          }
          // If still missing, set to N/A
          dateStr = dateStr || "N/A";
          from = from || "-";
          to = to || "-";
          return {
            id: item.ID || idx,
            title,
            date: dateStr,
            time: `${from} - ${to}`,
          };
        }));
        setUpcomingAppointments(appointmentsWithTasks);
      } catch (err) {
        setUpcomingAppointments([]);
      }
    };
    fetchAppointments();
    interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, [router]);

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

  // When profile modal opens, show credits dialog
  useEffect(() => {
    if (showProfileDialog && profile?.Credits !== undefined) {
      setCreditsBefore(profile.Credits);
      setShowCreditsDialog(true);
    }
  }, [showProfileDialog, profile]);

  // Helper to add a skill
  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput("");
    }
  };

  // After profile is saved, fetch profile and show bonus dialog
  const handleProfileSaved = async () => {
    setProfileSaved(true);
    setTimeout(async () => {
      setShowProfileDialog(false);
      setProfileSaved(false);
      // Fetch updated profile
      const token = localStorage.getItem("token");
      if (token) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_PROFILE_API_URL}/api/profile/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCreditsAfter(data.Credits);
          setProfile(data);
          setShowBonusDialog(true);
          setTimeout(() => setShowBonusDialog(false), 3000);
        }
      }
    }, 2000);
  };

  if (loading) return null;

  return (
    <ProtectedLayout>
      <div
        className={`${
          isDarkMode ? "bg-black text-white" : "bg-white text-black"
        } min-h-screen flex`}
      >
        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Top Grid: Welcome and Listings Activity side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Welcome Card (left) */}
            <div className="bg-white rounded-2xl p-8 flex flex-col justify-center h-full" style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06), 0 -2px 8px 0 rgba(0,0,0,0.04)" }}>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-gray-900">
                {`Welcome, ${profile?.Name?.split(' ')[0] || 'User'}`}
              </h1>
              <p className="text-base text-gray-500 mb-6">Monitor your recent activity, credits, listings, and appointments at a glance.</p>
              <div className="grid grid-cols-4 gap-6 mt-4">
                {/* Total Tasks */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  </div>
                  <div className="text-xs text-gray-500">Total Tasks</div>
                  <div className="text-xl font-bold text-gray-900">{taskStats.total}</div>
                </div>
                {/* Total Credits */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center mb-2">
                    <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#a855f7">#</text></svg>
                  </div>
                  <div className="text-xs text-gray-500">Total Credits</div>
                  <div className="text-xl font-bold text-gray-900">{profile?.Credits ?? 0}</div>
                </div>
                {/* Active Listings */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                    <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div className="text-xs text-gray-500">Active Listings</div>
                  <div className="text-xl font-bold text-gray-900">3</div>
                </div>
                {/* Appointments */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-cyan-50 flex items-center justify-center mb-2">
                    <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12h4l2 2" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="text-xs text-gray-500">Appointments</div>
                  <div className="text-xl font-bold text-gray-900">2</div>
                </div>
              </div>
            </div>
            {/* Listings Activity Card (right) */}
            <div className="bg-white rounded-2xl p-8 flex flex-col justify-center h-full" style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06), 0 -2px 8px 0 rgba(0,0,0,0.04)" }}>
              <h2 className="text-lg font-semibold mb-2">Listings Activity (Last 7 Days)</h2>
              <div className="h-48 flex items-end gap-8 w-full">
                {/* Mock data for 7 days */}
                {[
                  { day: 'Mon', new: 2, completed: 1, updated: 1 },
                  { day: 'Tue', new: 1, completed: 2, updated: 0 },
                  { day: 'Wed', new: 3, completed: 1, updated: 2 },
                  { day: 'Thu', new: 0, completed: 2, updated: 1 },
                  { day: 'Fri', new: 2, completed: 0, updated: 1 },
                  { day: 'Sat', new: 1, completed: 1, updated: 0 },
                  { day: 'Sun', new: 0, completed: 2, updated: 1 },
                ].map((d, i) => (
                  <div key={i} className="flex flex-col items-center flex-1">
                    {/* Bars */}
                    <div className="flex flex-col-reverse h-32 justify-end w-full items-center">
                      <div style={{height: `${d.new * 16}px`}} className="w-4 rounded bg-blue-400 mb-1" title={`New: ${d.new}`}></div>
                      <div style={{height: `${d.completed * 16}px`}} className="w-4 rounded bg-green-400 mb-1" title={`Completed: ${d.completed}`}></div>
                      <div style={{height: `${d.updated * 16}px`}} className="w-4 rounded bg-orange-400" title={`Updated: ${d.updated}`}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{d.day}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-400 rounded inline-block"></span> New</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded inline-block"></span> Completed</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-400 rounded inline-block"></span> Updated</div>
              </div>
            </div>
          </div>

          {/* Main Grid: Left (2/3) and Right (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Recent Task Activity + Recent Tasks */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Recent Task Activity Chart Placeholder */}
              
              {/* Recent Tasks Table */}
              <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06), 0 -2px 8px 0 rgba(0,0,0,0.04)" }}>
                <h2 className="text-lg font-semibold mb-2">Recent Tasks</h2>
                <div className="space-y-4">
                  {(taskStats.recent.length === 0) ? (
                    <div className="text-center py-4 text-gray-400">No recent tasks.</div>
                  ) : (
                    taskStats.recent.map((t: Task, i) => (
                      <div
                        key={i}
                        className="flex items-center bg-white rounded-xl px-4 py-3 transition-shadow"
                        style={{ borderLeft: `5px solid ${['#22c55e', '#a855f7', '#0ea5e9', '#f59e42', '#f43f5e'][i % 5]}`, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)' }}
                      >
                        {/* Avatar/Icon */}
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </div>
                        {/* Task Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{t.Title || t.title}</div>
                          <div className="text-xs text-gray-500">{t.Credits || t.credits} credits</div>
                        </div>
                        {/* Status */}
                        <div className="mr-4">
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Completed</span>
                        </div>
                        {/* Actions */}
                        <div className="flex gap-2">
                          <button className="w-9 h-9 rounded-full bg-teal-400 flex items-center justify-center text-white hover:bg-teal-500 transition" title="Call">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                          </button>
                          <button className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center text-white hover:bg-yellow-500 transition" title="Message">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h12a2 2 0 012 2z" /></svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            {/* Right: Top Helpers, Profile Completion, Appointments */}
            <div className="flex flex-col gap-8">
              {/* People You Contacted */}
              <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06), 0 -2px 8px 0 rgba(0,0,0,0.04)" }}>
                <h2 className="text-lg font-semibold mb-2">People You Contacted</h2>
                <div className="flex gap-4 items-center">
                  {[
                    { name: "Sarah Kim", img: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&w=80&h=80&fit=crop" },
                    { name: "Daniel Ortiz", img: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&w=80&h=80&fit=crop" },
                    { name: "Ayesha Patel", img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&w=80&h=80&fit=crop" },
                    { name: "Michael Chen", img: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&w=80&h=80&fit=crop" },
                    { name: "Olivia Brown", img: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&w=80&h=80&fit=crop" },
                  ].map((user, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <img src={user.img} alt={user.name} className="w-12 h-12 rounded-full border-2 border-white shadow mb-1 object-cover" />
                      <span className="text-xs text-gray-700 text-center max-w-[60px] truncate">{user.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Profile Completion */}
              <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06), 0 -2px 8px 0 rgba(0,0,0,0.04)" }}>
                <h2 className="text-lg font-semibold mb-2">Profile Completion</h2>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                  <div className="bg-emerald-400 h-3 rounded-full" style={{width: '80%'}}></div>
                </div>
                <div className="text-xs text-gray-500">80% complete</div>
              </div>
              {/* Upcoming Appointments */}
              <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.06), 0 -2px 8px 0 rgba(0,0,0,0.04)" }}>
                <h2 className="text-lg font-semibold mb-2">Upcoming Appointments</h2>
                <ul className="text-sm space-y-2">
                  {upcomingAppointments.length === 0 ? (
                    <li className="text-gray-400">No upcoming appointments.</li>
                  ) : (
                    upcomingAppointments.map((appt, idx) => (
                      <li key={appt.id || idx} className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 mr-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </span>
                        <span className="font-medium text-gray-800">{appt.title}</span>
                        <span className="text-xs text-gray-500 ml-auto">{appt.date}, {appt.time}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
        </main>

        {/* ─── new profile-completion dialog (2-step) ───────────────────────────── */}
        {showProfileDialog && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-gradient-to-br from-[#e0fce6] via-white to-[#bbf7d0] p-8 rounded-2xl shadow-2xl w-full max-w-xl space-y-6 text-[#1a1446] border border-[#22c55e]/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-[#22c55e] rounded-full">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="block">
                    <path d="M6 12.5l4 4 8-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Complete Your Profile
              </h2>
              {/* Step 1: Basic academic info */}
              {profileStep === 1 && (
                <div className="space-y-4">
                  <div className="text-green-700 bg-green-50 border border-green-200 rounded-full px-4 py-2 font-medium text-center">
                    Complete your profile to get <span className="font-bold">200 bonus credits!</span>
                  </div>
                  {formError && (
                    <div className="text-red-600 text-sm mb-2 font-medium">{formError}</div>
                  )}
                  <input
                    type="text"
                    placeholder="College/University"
                    value={formData.university}
                    onChange={e => {
                      setFormData({ ...formData, university: e.target.value });
                      if (formError) setFormError("");
                    }}
                    className="w-full px-5 py-3 border border-gray-200 rounded-full bg-white text-[#1a1446] placeholder-gray-400 text-base focus:border-[#22c55e] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Program/Major"
                    value={formData.program}
                    onChange={e => {
                      setFormData({ ...formData, program: e.target.value });
                      if (formError) setFormError("");
                    }}
                    className="w-full px-5 py-3 border border-gray-200 rounded-full bg-white text-[#1a1446] placeholder-gray-400 text-base focus:border-[#22c55e] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Year of Study (e.g. 2nd Year BSc)"
                    value={formData.yearOfStudy}
                    onChange={e => {
                      setFormData({ ...formData, yearOfStudy: e.target.value });
                      if (formError) setFormError("");
                    }}
                    className="w-full px-5 py-3 border border-gray-200 rounded-full bg-white text-[#1a1446] placeholder-gray-400 text-base focus:border-[#22c55e] outline-none"
                  />
                  <div className="text-right">
                    <button
                      onClick={() => {
                        if (!formData.university || !formData.program || !formData.yearOfStudy) {
                          setFormError("All fields are required.");
                          return;
                        }
                        setFormError("");
                        setProfileStep(2);
                      }}
                      className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 py-2 rounded-full font-semibold shadow-sm transition"
                    >
                      Next ➝
                    </button>
                  </div>
                </div>
              )}
              {/* Step 2: Skills & interests */}
              {profileStep === 2 && (
                <div className="space-y-6">
                  {formError && (
                    <div className="text-red-600 text-sm mb-2 font-medium">{formError}</div>
                  )}
                  <div>
                    <label className="text-sm font-medium block mb-1 text-[#15803d]">Skills & Interests</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.skills.map((tag) => (
                        <span
                          key={tag}
                          className="bg-[#e0fce6] text-[#15803d] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-[#22c55e]/30"
                        >
                          {tag}
                          <button
                            onClick={() => setFormData({ ...formData, skills: formData.skills.filter((t) => t !== tag) })}
                            className="text-[#22c55e] font-bold leading-none ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={skillInput}
                        onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        placeholder="e.g. #Python"
                        className="flex-1 px-5 py-3 border border-gray-200 rounded-full bg-white text-[#1a1446] placeholder-gray-400 text-base focus:border-[#22c55e] outline-none"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 py-2 rounded-full font-semibold shadow-sm transition"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => {
                        setFormError("");
                        setProfileStep(1);
                      }}
                      className="text-sm text-[#22c55e] hover:underline font-medium px-4 py-2 rounded-full bg-[#f0fdf4]"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={async () => {
                        if (!formData.skills || formData.skills.length === 0) {
                          setFormError("Please add at least one skill.");
                          return;
                        }
                        try {
                          await updateProfile();
                          handleProfileSaved();
                        } catch (e) {
                          alert((e as Error).message);
                        }
                      }}
                      className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-8 py-2 rounded-full font-semibold shadow-sm transition"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              )}
              {profileSaved && (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-2 font-medium justify-center">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-8" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Profile saved! You have received <span className="font-bold ml-1">200 bonus credits.</span>
                </div>
              )}
            </div>
          </div>
        )}
        {/* ─────────────────────────────────────────────────────────────────────── */}
        {showBonusDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl px-8 py-8 flex flex-col items-center gap-4 min-w-[320px] max-w-[90vw]">
              <div className="text-lg font-semibold text-[#1a1446] text-center">Your new credits: <span className="font-bold">{creditsAfter}</span></div>
              <div className="text-gray-600 text-center">{creditsAfter && creditsBefore !== null && creditsAfter > creditsBefore ? "Bonus applied!" : "No bonus applied."}</div>
              <button onClick={() => setShowBonusDialog(false)} className="mt-4 bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 py-2 rounded-full font-semibold">OK</button>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
