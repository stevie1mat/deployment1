"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  status: "upcoming" | "past";
  taskId?: string;
  taskOwnerId?: string;
  taskOwnerEmail?: string;
}

export default function AppointmentsPage() {
  const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>([]); // I booked
  const [withMeAppointments, setWithMeAppointments] = useState<Appointment[]>([]); // Booked with me
  const [loading, setLoading] = useState(true);
  const [messageModal, setMessageModal] = useState<{ open: boolean; appt: Appointment | null }>({ open: false, appt: null });
  const [firstMessage, setFirstMessage] = useState("");
  const [sendingFirstMessage, setSendingFirstMessage] = useState(false);
  const [dialog, setDialog] = useState<{ open: boolean; message: string; isError?: boolean }>({ open: false, message: "", isError: false });
  const router = useRouter();
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_TASK_API_URL || "http://localhost:8084";

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }
      let userId;
      try {
        const profileRes = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8080'}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) throw new Error("Failed to fetch user profile");
        const profileData = await profileRes.json();
        userId = profileData.ID || profileData.id;
        if (!userId) throw new Error("User ID not found in profile");
      } catch (error) {
        setLoading(false);
        return;
      }
      // Helper to format bookings
      const formatBookings = async (bookings: any[]) => {
        const now = new Date();
        return await Promise.all(bookings.map(async (item: any, idx: number) => {
          let dateStr = item.Timeslot?.date || null;
          let from = item.Timeslot?.timeFrom || null;
          let to = item.Timeslot?.timeTo || null;
          let title = "(No title)";
          let location = "(No location)";
          let taskId: string | undefined;
          let taskOwnerId: string | undefined;
          let taskOwnerEmail: string | undefined;
          if (item.TaskID) {
            try {
              const taskRes = await fetch(`${API_BASE_URL}/api/tasks/get/${item.TaskID}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (taskRes.ok) {
                const taskData = await taskRes.json();
                title = taskData.Title || taskData.title || title;
                location = taskData.Location || taskData.location || location;
                taskId = taskData.ID || taskData.$oid;
                taskOwnerId = taskData.Author?.ID || taskData.Author?.id;
                taskOwnerEmail = taskData.Author?.Email || taskData.Author?.email;
                if (!dateStr || !from || !to) {
                  dateStr = taskData.Availability?.[0]?.Date || null;
                  from = taskData.Availability?.[0]?.TimeFrom || null;
                  to = taskData.Availability?.[0]?.TimeTo || null;
                }
              }
            } catch {}
          }
          dateStr = dateStr || "N/A";
          from = from || "-";
          to = to || "-";
          const dateTime = new Date(`${dateStr}T${from}`);
          const isUpcoming = dateTime.getTime() > now.getTime();
          return {
            id: item.ID || idx,
            title,
            date: dateStr,
            time: `${from} - ${to}`,
            location,
            status: isUpcoming ? "upcoming" as const : "past" as const,
            taskId,
            taskOwnerId,
            taskOwnerEmail,
          };
        }));
      };
      try {
        // Bookings I made (booker)
        const resBooker = await fetch(
          `${API_BASE_URL}/api/bookings?role=booker&id=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        let booked: Appointment[] = [];
        if (resBooker.ok) {
          const json = await resBooker.json();
          if (json && Array.isArray(json.data)) {
            booked = await formatBookings(json.data);
          } else if (Array.isArray(json)) {
            booked = await formatBookings(json);
          } else {
            booked = await formatBookings([]);
          }
        }
        setBookedAppointments(booked);
        // Bookings with me (owner)
        const resOwner = await fetch(
          `${API_BASE_URL}/api/bookings?role=owner&id=${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        let withMe: Appointment[] = [];
        if (resOwner.ok) {
          const json = await resOwner.json();
          if (json && Array.isArray(json.data)) {
            withMe = await formatBookings(json.data);
          } else if (Array.isArray(json)) {
            withMe = await formatBookings(json);
          } else {
            withMe = await formatBookings([]);
          }
        }
        setWithMeAppointments(withMe);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const upcomingBooked = bookedAppointments.filter((a) => a.status === "upcoming");
  const pastBooked = bookedAppointments.filter((a) => a.status === "past");
  const upcomingWithMe = withMeAppointments.filter((a) => a.status === "upcoming");
  const pastWithMe = withMeAppointments.filter((a) => a.status === "past");

  async function handleSendFirstMessage(appt: any) {
    if (!appt || !appt.taskId || !appt.taskOwnerId) {
      setDialog({ open: true, message: "No task or owner info found.", isError: true });
      return;
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    let currentUserEmail = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        currentUserEmail = payload.email;
      } catch {}
    }
    if (!token || !currentUserEmail) {
      setDialog({
        open: true,
        message: `You must be logged in to message.`,
        isError: true
      });
      return;
    }
    if (!firstMessage.trim()) {
      setDialog({ open: true, message: "Please enter a message.", isError: true });
      return;
    }
    setSendingFirstMessage(true);
    try {
      // 1. Create/find conversation
      const res = await fetch(`${process.env.NEXT_PUBLIC_MESSAGING_API_URL || 'http://localhost:8085'}/api/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          type: "direct",
          name: `Task: ${appt.title}`,
          avatar: "",
          participants: [currentUserEmail, appt.taskOwnerEmail].sort(),
          taskId: appt.taskId
        })
      });
      if (!res.ok) {
        const errorText = await res.text();
        setDialog({ open: true, message: `Failed to start conversation: ${errorText}`, isError: true });
        setSendingFirstMessage(false);
        return;
      }
      const data = await res.json();
      const conversationId = data.$oid || data || "";
      if (typeof window !== 'undefined') {
        sessionStorage.setItem("autoSelectConversationId", conversationId);
      }
      // 2. Send first message
      const messageRes = await fetch(`${process.env.NEXT_PUBLIC_MESSAGING_API_URL || 'http://localhost:8085'}/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content: firstMessage,
          senderId: currentUserEmail,
          senderName: "",
          senderAvatar: "",
          type: "text"
        })
      });
      if (!messageRes.ok) {
        const errorText = await messageRes.text();
        setDialog({ open: true, message: `Failed to send message: ${errorText}`, isError: true });
        setSendingFirstMessage(false);
        return;
      }
      setDialog({ open: true, message: "Message sent! Redirecting to chat...", isError: false });
      setTimeout(() => {
        setDialog({ open: false, message: "", isError: false });
        setMessageModal({ open: false, appt: null });
        setFirstMessage("");
        setSendingFirstMessage(false);
        router.push("/messages");
      }, 1200);
    } catch (err) {
      setDialog({ open: true, message: `Error: ${err instanceof Error ? err.message : String(err)}` , isError: true });
      setSendingFirstMessage(false);
    }
  }

  return (
    <ProtectedLayout>
      <div className="w-full px-4 md:px-8 py-10">
        {loading ? (
          <div className="text-gray-500">Loading appointments...</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Appointments I Booked */}
            <section className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Appointments I Booked</h2>
              {bookedAppointments.length === 0 ? (
                <div className="text-gray-500">No appointments found.</div>
              ) : (
                <div className="space-y-4">
                  {bookedAppointments.map((appt, idx) => (
                    <div
                      key={appt.id || `${appt.title}-${appt.date}-${appt.time}-${idx}`}
                      className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-lg">{appt.title}</div>
                          <div className="text-gray-500 text-sm">{appt.date} | {appt.time}</div>
                          <div className="text-gray-400 text-xs">{appt.location}</div>
                        </div>
                        <div className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                          {appt.status === "upcoming" ? "Upcoming" : "Past"}
                        </div>
                      </div>
                      {appt.status === "upcoming" && (
                        <div className="flex justify-end mt-2">
                          <button
                            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            onClick={() => setMessageModal({ open: true, appt })}
                          >
                            💬 Message
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
            {/* Vertical divider for desktop */}
            <div className="hidden md:block w-px bg-gray-200" />
            {/* Right: Appointments Booked With Me */}
            <section className="flex-1">
              <h2 className="text-2xl font-bold mb-4">Appointments Booked With Me</h2>
              {withMeAppointments.length === 0 ? (
                <div className="text-gray-500">No appointments found.</div>
              ) : (
                <div className="space-y-4">
                  {withMeAppointments.map((appt, idx) => (
                    <div
                      key={appt.id || `${appt.title}-${appt.date}-${appt.time}-${idx}`}
                      className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-100"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-lg">{appt.title}</div>
                          <div className="text-gray-500 text-sm">{appt.date} | {appt.time}</div>
                          <div className="text-gray-400 text-xs">{appt.location}</div>
                        </div>
                        <div className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">
                          {appt.status === "upcoming" ? "Upcoming" : "Past"}
                        </div>
                      </div>
                      {appt.status === "upcoming" && (
                        <div className="flex justify-end mt-2">
                          <button
                            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            onClick={() => setMessageModal({ open: true, appt })}
                          >
                            💬 Message
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
      {/* Message Modal */}
      {messageModal.open && messageModal.appt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-lg p-8 min-w-[320px] text-center border border-blue-400">
            <div className="mb-2 text-lg font-semibold text-blue-600">Send a message about this task</div>
            <textarea
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 min-h-[80px]"
              placeholder="Type your message..."
              value={firstMessage}
              onChange={e => setFirstMessage(e.target.value)}
              disabled={sendingFirstMessage}
            />
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => { setMessageModal({ open: false, appt: null }); setFirstMessage(""); }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                disabled={sendingFirstMessage}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSendFirstMessage(messageModal.appt)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={sendingFirstMessage}
              >
                {sendingFirstMessage ? "Sending..." : "Send & Start Chat"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Dialog for errors/success */}
      {dialog.open && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30`}>
          <div className={`bg-white rounded-xl shadow-lg p-8 min-w-[320px] text-center border ${dialog.isError ? 'border-red-400' : 'border-green-400'}`}>
            <div className={`mb-2 text-lg font-semibold ${dialog.isError ? 'text-red-600' : 'text-green-600'}`}>{dialog.isError ? 'Error' : 'Success'}</div>
            <div className="mb-4 text-gray-700">{dialog.message}</div>
            {!sendingFirstMessage && dialog.isError && (
              <button onClick={() => setDialog({ open: false, message: "", isError: false })} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Close</button>
            )}
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </ProtectedLayout>
  );
}