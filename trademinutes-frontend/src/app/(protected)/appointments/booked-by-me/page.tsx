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
  taskId?: string;
}

export default function BookedByMePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmittedId, setReviewSubmittedId] = useState<string | null>(null);
  const [reviewedTaskIds, setReviewedTaskIds] = useState<string[]>([]);

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
        const res = await fetch(`${API_BASE_URL}/api/bookings?role=booker&id=${userId}`, {
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
          taskId: b.TaskID || b.TaskId || b.taskId || b.task?.ID || b.task?.id || "",
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

  useEffect(() => {
    const fetchReviewed = async () => {
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
      if (!userId) return;
      const API_BASE_URL = process.env.NEXT_PUBLIC_REVIEW_API_URL || 'http://localhost:8086';
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews?reviewerId=${userId}`);
        if (!res.ok) return;
        const data = await res.json();
        setReviewedTaskIds(Array.isArray(data) ? data.map((r: any) => r.taskId) : []);
      } catch (err) {
        // ignore
      }
    };
    fetchReviewed();
  }, []);

  // Group bookings by status
  const completedBookings = bookings.filter(b => b.status && b.status.toLowerCase() === 'completed');
  const confirmedBookings = bookings.filter(b => b.status && b.status.toLowerCase() === 'confirmed');
  const pendingBookings = bookings.filter(b => b.status && b.status.toLowerCase() === 'pending');
  const cancelledBookings = bookings.filter(b => b.status && b.status.toLowerCase() === 'cancelled');

  // Sort bookings: completed > confirmed > pending > cancelled
  const statusOrder = { completed: 0, confirmed: 1, pending: 2, cancelled: 3 };
  const sortedBookings = [...bookings].sort((a, b) => {
    const aStatus = a.status ? a.status.toLowerCase() : '';
    const bStatus = b.status ? b.status.toLowerCase() : '';
    return (statusOrder[aStatus as keyof typeof statusOrder] ?? 99) - (statusOrder[bStatus as keyof typeof statusOrder] ?? 99);
  });

  return (
    <ProtectedLayout headerName="Booked by Me">
      <div className="min-h-screen bg-white p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold mb-6 text-emerald-700">Booked by Me</h1>
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
              const hasReviewed = reviewedTaskIds.includes(b.taskId || "");
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
                      ''
                    }`}
                    style={{ marginTop: '0.75rem' }}
                  >
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                  {b.status && b.status.toLowerCase() === 'completed' && !hasReviewed && (
                    <button
                      className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      onClick={() => setShowReviewModal(b.id)}
                    >
                      Leave a Review
                    </button>
                  )}
                  {b.status && b.status.toLowerCase() === 'completed' && hasReviewed && (
                    <button
                      className="mt-4 w-full bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Review Submitted
                    </button>
                  )}
                  {/* Review Modal */}
                  {showReviewModal === b.id && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
                      <div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
                        <div className="mb-4">
                          <label className="block mb-2 font-medium">Rating:</label>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className={star <= reviewRating ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}
                                onClick={() => setReviewRating(star)}
                                style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                                tabIndex={0}
                                aria-label={`Set rating to ${star}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block mb-2 font-medium">Comment:</label>
                          <textarea
                            className="w-full border rounded p-2"
                            rows={3}
                            value={reviewComment}
                            onChange={e => setReviewComment(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-4 justify-end">
                          <button
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            onClick={() => setShowReviewModal(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                            onClick={async () => {
                              // Submit review
                              const token = localStorage.getItem("token");
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
                              if (!userId || !b.taskId) return;
                              const API_BASE_URL = process.env.NEXT_PUBLIC_REVIEW_API_URL || 'http://localhost:8086';
                              const res = await fetch(`${API_BASE_URL}/api/reviews`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  reviewerId: userId,
                                  revieweeId: null, // You may want to fetch the owner ID if needed
                                  taskId: b.taskId,
                                  rating: reviewRating,
                                  comment: reviewComment,
                                }),
                              });
                              if (res.ok) {
                                setReviewedTaskIds(prev => [...prev, b.taskId!]);
                                setShowReviewModal(null);
                                setReviewRating(0);
                                setReviewComment("");
                                setReviewSubmittedId(b.id);
                              } else {
                                alert("Failed to submit review");
                              }
                            }}
                            disabled={reviewRating === 0}
                          >
                            Submit Review
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {reviewSubmittedId === b.id && (
                    <div className="mt-4 text-green-700 font-semibold">Review submitted!</div>
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
              const hasReviewed = reviewedTaskIds.includes(b.taskId || "");
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
                      ''
                    }`}
                    style={{ marginTop: '0.75rem' }}
                  >
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                  {b.status && b.status.toLowerCase() === 'completed' && !hasReviewed && (
                    <button
                      className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      onClick={() => setShowReviewModal(b.id)}
                    >
                      Leave a Review
                    </button>
                  )}
                  {b.status && b.status.toLowerCase() === 'completed' && hasReviewed && (
                    <button
                      className="mt-4 w-full bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Review Submitted
                    </button>
                  )}
                  {/* Review Modal */}
                  {showReviewModal === b.id && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
                      <div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
                        <div className="mb-4">
                          <label className="block mb-2 font-medium">Rating:</label>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className={star <= reviewRating ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}
                                onClick={() => setReviewRating(star)}
                                style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                                tabIndex={0}
                                aria-label={`Set rating to ${star}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block mb-2 font-medium">Comment:</label>
                          <textarea
                            className="w-full border rounded p-2"
                            rows={3}
                            value={reviewComment}
                            onChange={e => setReviewComment(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-4 justify-end">
                          <button
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            onClick={() => setShowReviewModal(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                            onClick={async () => {
                              // Submit review
                              const token = localStorage.getItem("token");
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
                              if (!userId || !b.taskId) return;
                              const API_BASE_URL = process.env.NEXT_PUBLIC_REVIEW_API_URL || 'http://localhost:8086';
                              const res = await fetch(`${API_BASE_URL}/api/reviews`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  reviewerId: userId,
                                  revieweeId: null, // You may want to fetch the owner ID if needed
                                  taskId: b.taskId,
                                  rating: reviewRating,
                                  comment: reviewComment,
                                }),
                              });
                              if (res.ok) {
                                setReviewedTaskIds(prev => [...prev, b.taskId!]);
                                setShowReviewModal(null);
                                setReviewRating(0);
                                setReviewComment("");
                                setReviewSubmittedId(b.id);
                              } else {
                                alert("Failed to submit review");
                              }
                            }}
                            disabled={reviewRating === 0}
                          >
                            Submit Review
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {reviewSubmittedId === b.id && (
                    <div className="mt-4 text-green-700 font-semibold">Review submitted!</div>
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
              const hasReviewed = reviewedTaskIds.includes(b.taskId || "");
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
                      ''
                    }`}
                    style={{ marginTop: '0.75rem' }}
                  >
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                  {b.status && b.status.toLowerCase() === 'completed' && !hasReviewed && (
                    <button
                      className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      onClick={() => setShowReviewModal(b.id)}
                    >
                      Leave a Review
                    </button>
                  )}
                  {b.status && b.status.toLowerCase() === 'completed' && hasReviewed && (
                    <button
                      className="mt-4 w-full bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Review Submitted
                    </button>
                  )}
                  {/* Review Modal */}
                  {showReviewModal === b.id && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
                      <div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
                        <div className="mb-4">
                          <label className="block mb-2 font-medium">Rating:</label>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className={star <= reviewRating ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}
                                onClick={() => setReviewRating(star)}
                                style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                                tabIndex={0}
                                aria-label={`Set rating to ${star}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block mb-2 font-medium">Comment:</label>
                          <textarea
                            className="w-full border rounded p-2"
                            rows={3}
                            value={reviewComment}
                            onChange={e => setReviewComment(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-4 justify-end">
                          <button
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            onClick={() => setShowReviewModal(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                            onClick={async () => {
                              // Submit review
                              const token = localStorage.getItem("token");
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
                              if (!userId || !b.taskId) return;
                              const API_BASE_URL = process.env.NEXT_PUBLIC_REVIEW_API_URL || 'http://localhost:8086';
                              const res = await fetch(`${API_BASE_URL}/api/reviews`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  reviewerId: userId,
                                  revieweeId: null, // You may want to fetch the owner ID if needed
                                  taskId: b.taskId,
                                  rating: reviewRating,
                                  comment: reviewComment,
                                }),
                              });
                              if (res.ok) {
                                setReviewedTaskIds(prev => [...prev, b.taskId!]);
                                setShowReviewModal(null);
                                setReviewRating(0);
                                setReviewComment("");
                                setReviewSubmittedId(b.id);
                              } else {
                                alert("Failed to submit review");
                              }
                            }}
                            disabled={reviewRating === 0}
                          >
                            Submit Review
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {reviewSubmittedId === b.id && (
                    <div className="mt-4 text-green-700 font-semibold">Review submitted!</div>
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
              const hasReviewed = reviewedTaskIds.includes(b.taskId || "");
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
                      ''
                    }`}
                    style={{ marginTop: '0.75rem' }}
                  >
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                  {b.status && b.status.toLowerCase() === 'completed' && !hasReviewed && (
                    <button
                      className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
                      onClick={() => setShowReviewModal(b.id)}
                    >
                      Leave a Review
                    </button>
                  )}
                  {b.status && b.status.toLowerCase() === 'completed' && hasReviewed && (
                    <button
                      className="mt-4 w-full bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Review Submitted
                    </button>
                  )}
                  {/* Review Modal */}
                  {showReviewModal === b.id && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm z-50">
                      <div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
                        <div className="mb-4">
                          <label className="block mb-2 font-medium">Rating:</label>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className={star <= reviewRating ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}
                                onClick={() => setReviewRating(star)}
                                style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                                tabIndex={0}
                                aria-label={`Set rating to ${star}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block mb-2 font-medium">Comment:</label>
                          <textarea
                            className="w-full border rounded p-2"
                            rows={3}
                            value={reviewComment}
                            onChange={e => setReviewComment(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-4 justify-end">
                          <button
                            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            onClick={() => setShowReviewModal(null)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                            onClick={async () => {
                              // Submit review
                              const token = localStorage.getItem("token");
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
                              if (!userId || !b.taskId) return;
                              const API_BASE_URL = process.env.NEXT_PUBLIC_REVIEW_API_URL || 'http://localhost:8086';
                              const res = await fetch(`${API_BASE_URL}/api/reviews`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  reviewerId: userId,
                                  revieweeId: null, // You may want to fetch the owner ID if needed
                                  taskId: b.taskId,
                                  rating: reviewRating,
                                  comment: reviewComment,
                                }),
                              });
                              if (res.ok) {
                                setReviewedTaskIds(prev => [...prev, b.taskId!]);
                                setShowReviewModal(null);
                                setReviewRating(0);
                                setReviewComment("");
                                setReviewSubmittedId(b.id);
                              } else {
                                alert("Failed to submit review");
                              }
                            }}
                            disabled={reviewRating === 0}
                          >
                            Submit Review
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {reviewSubmittedId === b.id && (
                    <div className="mt-4 text-green-700 font-semibold">Review submitted!</div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
} 