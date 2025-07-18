"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";
import dayjs from "dayjs";

interface Booking {
  id: string;
  taskTitle: string;
  date: string;
  timeFrom: string;
  timeTo: string;
  status: string;
}

export default function BookedFromMePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ open: boolean; message: string; isError: boolean }>({ open: false, message: '', isError: false });

  // Confirm booking handler
  const handleConfirm = async (bookingId: string) => {
    setConfirmingId(bookingId);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      const API_BASE_URL = process.env.NEXT_PUBLIC_TASK_API_URL || 'http://localhost:8084';
      const res = await fetch(`${API_BASE_URL}/api/bookings/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ bookingId }),
      });
      if (!res.ok) throw new Error("Failed to confirm booking");
      // Update UI
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "confirmed" } : b));
    } catch (err) {
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setConfirmingId(null);
    }
  };

  // Complete booking handler
  const handleComplete = async (bookingId: string) => {
    setCompletingId(bookingId);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      const API_BASE_URL = process.env.NEXT_PUBLIC_TASK_API_URL || 'http://localhost:8084';
      const res = await fetch(`${API_BASE_URL}/api/bookings/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ bookingId }),
      });
      if (!res.ok) throw new Error("Failed to mark as completed");
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: "completed" } : b));
      setDialog({ open: true, message: "Booking and task marked as completed. Client will be notified.", isError: false });
    } catch (err) {
      setDialog({ open: true, message: "Failed to mark as completed. Please try again.", isError: true });
    } finally {
      setCompletingId(null);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
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
        const res = await fetch(`${API_BASE_URL}/api/bookings?role=owner&id=${userId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        const bookings = (data.data || data || []).map((b: any) => ({
          id: b.ID || b.id || b._id,
          taskTitle: b.TaskTitle || b.taskTitle || b.task?.Title || b.task?.title || "",
          date: b.Timeslot?.Date || b.timeslot?.date || "",
          timeFrom: b.Timeslot?.TimeFrom || b.timeslot?.timeFrom || "",
          timeTo: b.Timeslot?.TimeTo || b.timeslot?.timeTo || "",
          status: b.Status || b.status || "",
        }));
        setBookings(bookings);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Sort bookings: completed > confirmed > pending > cancelled
  const statusOrder = { completed: 0, confirmed: 1, pending: 2, cancelled: 3 };
  const sortedBookings = [...bookings].sort((a, b) => {
    const aStatus = a.status ? a.status.toLowerCase() : '';
    const bStatus = b.status ? b.status.toLowerCase() : '';
    return (statusOrder[aStatus as keyof typeof statusOrder] ?? 99) - (statusOrder[bStatus as keyof typeof statusOrder] ?? 99);
  });

  // Group bookings by status
  const completedBookings = bookings.filter(b => b.status && b.status.toLowerCase() === 'completed');
  const confirmedBookings = bookings.filter(b => b.status && b.status.toLowerCase() === 'confirmed');
  const pendingBookings = bookings.filter(b => b.status && b.status.toLowerCase() === 'pending');
  const cancelledBookings = bookings.filter(b => b.status && b.status.toLowerCase() === 'cancelled');

  return (
    <ProtectedLayout headerName="Booked from Me">
      <div className="min-h-screen bg-white p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold mb-6 text-emerald-700">New Bookings</h1>
        </div>
        {/* Completed */}
        <h2 className="text-xl font-bold mb-4 mt-8">Completed</h2>
        {completedBookings.length === 0 ? (
          <p>No completed bookings.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {completedBookings.map((b, idx) => {
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
                  key={b.id}
                  className={`bg-white rounded-lg p-5 shadow-md hover:shadow-xl relative border-2 ${borderClass}`}
                >
                  <h3 className="text-lg font-semibold mb-1">{b.taskTitle}</h3>
                  <p className="text-xs text-gray-500 mb-1">
                    📅 {b.date} — ⏰ {b.timeFrom} to {b.timeTo}
                  </p>
                  <span
                    className={`inline-block text-base font-semibold px-3 py-1 rounded-full bg-gray-100 border border-gray-300 mt-3 ${
                      b.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-300' :
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-300' :
                      b.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                      b.status === 'completed' ? 'bg-gray-200 text-emerald-700 border-emerald-300' :
                      ''
                    }`}
                    style={{ marginTop: '0.75rem' }}
                  >
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                  {/* Confirm button for pending bookings */}
                  {b.status === 'pending' && (
                    <button
                      className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      onClick={() => handleConfirm(b.id)}
                      disabled={confirmingId === b.id}
                    >
                      {confirmingId === b.id ? 'Confirming...' : 'Confirm'}
                    </button>
                  )}
                  {b.status === 'confirmed' && (
                    <button
                      className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      onClick={() => handleComplete(b.id)}
                      disabled={completingId === b.id}
                    >
                      {completingId === b.id ? 'Completing...' : 'Mark as Completed'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {/* Confirmed */}
        <h2 className="text-xl font-bold mb-4 mt-8">Confirmed</h2>
        {confirmedBookings.length === 0 ? (
          <p>No confirmed bookings.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {confirmedBookings.map((b, idx) => {
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
                  key={b.id}
                  className={`bg-white rounded-lg p-5 shadow-md hover:shadow-xl relative border-2 ${borderClass}`}
                >
                  <h3 className="text-lg font-semibold mb-1">{b.taskTitle}</h3>
                  <p className="text-xs text-gray-500 mb-1">
                    📅 {b.date} — ⏰ {b.timeFrom} to {b.timeTo}
                  </p>
                  <span
                    className={`inline-block text-base font-semibold px-3 py-1 rounded-full bg-gray-100 border border-gray-300 mt-3 ${
                      b.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-300' :
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-300' :
                      b.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                      b.status === 'completed' ? 'bg-gray-200 text-emerald-700 border-emerald-300' :
                      ''
                    }`}
                    style={{ marginTop: '0.75rem' }}
                  >
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                  {/* Confirm button for pending bookings */}
                  {b.status === 'pending' && (
                    <button
                      className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      onClick={() => handleConfirm(b.id)}
                      disabled={confirmingId === b.id}
                    >
                      {confirmingId === b.id ? 'Confirming...' : 'Confirm'}
                    </button>
                  )}
                  {b.status === 'confirmed' && (
                    <button
                      className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      onClick={() => handleComplete(b.id)}
                      disabled={completingId === b.id}
                    >
                      {completingId === b.id ? 'Completing...' : 'Mark as Completed'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {/* Pending */}
        <h2 className="text-xl font-bold mb-4 mt-8">Pending</h2>
        {pendingBookings.length === 0 ? (
          <p>No pending bookings.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {pendingBookings.map((b, idx) => {
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
                  key={b.id}
                  className={`bg-white rounded-lg p-5 shadow-md hover:shadow-xl relative border-2 ${borderClass}`}
                >
                  <h3 className="text-lg font-semibold mb-1">{b.taskTitle}</h3>
                  <p className="text-xs text-gray-500 mb-1">
                    📅 {b.date} — ⏰ {b.timeFrom} to {b.timeTo}
                  </p>
                  <span
                    className={`inline-block text-base font-semibold px-3 py-1 rounded-full bg-gray-100 border border-gray-300 mt-3 ${
                      b.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-300' :
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-300' :
                      b.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                      b.status === 'completed' ? 'bg-gray-200 text-emerald-700 border-emerald-300' :
                      ''
                    }`}
                    style={{ marginTop: '0.75rem' }}
                  >
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                  {/* Confirm button for pending bookings */}
                  {b.status === 'pending' && (
                    <button
                      className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      onClick={() => handleConfirm(b.id)}
                      disabled={confirmingId === b.id}
                    >
                      {confirmingId === b.id ? 'Confirming...' : 'Confirm'}
                    </button>
                  )}
                  {b.status === 'confirmed' && (
                    <button
                      className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      onClick={() => handleComplete(b.id)}
                      disabled={completingId === b.id}
                    >
                      {completingId === b.id ? 'Completing...' : 'Mark as Completed'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {/* Cancelled */}
        <h2 className="text-xl font-bold mb-4 mt-8">Cancelled</h2>
        {cancelledBookings.length === 0 ? (
          <p>No cancelled bookings.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cancelledBookings.map((b, idx) => {
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
                  key={b.id}
                  className={`bg-white rounded-lg p-5 shadow-md hover:shadow-xl relative border-2 ${borderClass}`}
                >
                  <h3 className="text-lg font-semibold mb-1">{b.taskTitle}</h3>
                  <p className="text-xs text-gray-500 mb-1">
                    📅 {b.date} — ⏰ {b.timeFrom} to {b.timeTo}
                  </p>
                  <span
                    className={`inline-block text-base font-semibold px-3 py-1 rounded-full bg-gray-100 border border-gray-300 mt-3 ${
                      b.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-300' :
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-300' :
                      b.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                      b.status === 'completed' ? 'bg-gray-200 text-emerald-700 border-emerald-300' :
                      ''
                    }`}
                    style={{ marginTop: '0.75rem' }}
                  >
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                  {/* Confirm button for pending bookings */}
                  {b.status === 'pending' && (
                    <button
                      className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      onClick={() => handleConfirm(b.id)}
                      disabled={confirmingId === b.id}
                    >
                      {confirmingId === b.id ? 'Confirming...' : 'Confirm'}
                    </button>
                  )}
                  {b.status === 'confirmed' && (
                    <button
                      className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      onClick={() => handleComplete(b.id)}
                      disabled={completingId === b.id}
                    >
                      {completingId === b.id ? 'Completing...' : 'Mark as Completed'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {/* Dialog for completion feedback */}
        {dialog.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className={`bg-white rounded-xl shadow-lg p-8 min-w-[320px] text-center border ${dialog.isError ? 'border-red-400' : 'border-green-400'}`}>
              <div className={`mb-2 text-lg font-semibold ${dialog.isError ? 'text-red-600' : 'text-green-600'}`}>{dialog.isError ? 'Error' : 'Success'}</div>
              <div className="mb-4 text-gray-700">{dialog.message}</div>
              <button onClick={() => setDialog({ open: false, message: '', isError: false })} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Close</button>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
} 