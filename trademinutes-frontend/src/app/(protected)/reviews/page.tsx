"use client";

import { useEffect, useState } from "react";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";

interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  taskId: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
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
        const API_BASE_URL = process.env.NEXT_PUBLIC_REVIEW_API_URL || 'http://localhost:8086';
        const res = await fetch(`${API_BASE_URL}/api/reviews?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <ProtectedLayout headerName="My Reviews">
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-xl shadow border border-gray-200">
        <h1 className="text-2xl font-bold mb-6">My Reviews</h1>
        {loading ? (
          <div className="text-gray-500">Loading reviews...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : reviews.length === 0 ? (
          <div className="text-gray-500">No reviews found.</div>
        ) : (
          <ul className="space-y-6">
            {reviews.map((r) => (
              <li key={r.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-emerald-700">Rating:</span>
                  <span className="text-lg">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                </div>
                <div className="text-gray-700 mb-1">{r.comment}</div>
                <div className="text-xs text-gray-400">{new Date(r.createdAt * 1000).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedLayout>
  );
} 