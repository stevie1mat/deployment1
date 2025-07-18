"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProtectedLayout from "@/components/Layout/ProtectedLayout";

const MOCK_STATS = [
  { label: "Total Patients", value: 520 },
  { label: "Recovery Rate", value: "87%" },
  { label: "Review", value: "4.8 /5" },
  { label: "Today's Counselling", value: 5 },
  { label: "Completed Counselling", value: 350 },
  { label: "Upcoming Counselling", value: 15 },
];

const MOCK_SCHEDULE = [
  { time: "09:00 AM - 10:00 AM", title: "Emma Wilson", type: "Family Counseling", status: "Completed" },
  { time: "10:30 AM - 11:30 AM", title: "Ethan James", type: "Individual Therapy", status: "Ongoing" },
  { time: "12:00 PM - 01:00 PM", title: "Sophia Davis", type: "Family Counseling", status: "Pending" },
  { time: "01:45 PM - 02:45 PM", title: "Liam Thompson", type: "Family Counseling", status: "Pending" },
];

const MOCK_REVIEWS = [
  {
    name: "Emma Wilson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    date: "2 days ago",
    text: "Dr. Blake is very patient and helped my child feel comfortable during therapy. We saw noticeable improvements. He really listens to concerns and provides thoughtful solutions. My child feels more confident after each session."
  },
  {
    name: "Sophia Davis",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 4,
    date: "3 days ago",
    text: "Dr. Blake helped my family communicate better. Highly recommend him for family therapy. His approach is gentle yet effective, which made a difference. We are now resolving conflicts more constructively."
  },
  {
    name: "Liam Thompson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    date: "5 days ago",
    text: "The sessions are great. My family feels more connected, and my son is improving. Dr. Blake understands the underlying issues and addresses them thoughtfully. We're seeing positive changes in our family dynamic."
  },
  {
    name: "Ethan James",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4,
    date: "1 week ago",
    text: "Excellent therapist. Dr. Blake provided great insight and strategies to manage anxiety. He takes time to listen and support."
  }
];

export default function UserProfileSummaryPage() {
  const [profile, setProfile] = useState<{
    Name: string;
    Email: string;
    College?: string;
    Program?: string;
    YearOfStudy?: string;
    Skills?: string[];
    Credits?: number;
    Phone?: string;
    Address?: string;
    ID?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewerNames, setReviewerNames] = useState<{ [id: string]: string }>({});
  const router = useRouter();

  const fetchReviewsForMyTasks = async (userId: string) => {
    try {
      const TASK_API_BASE = process.env.NEXT_PUBLIC_TASK_API_URL || 'http://localhost:8084';
      const REVIEW_API_BASE = process.env.NEXT_PUBLIC_REVIEW_API_URL || 'http://localhost:8086';
      const token = localStorage.getItem("token");
      const res = await fetch(`${TASK_API_BASE}/api/tasks/get/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tasks = await res.json();
      const myTaskIds = (tasks.data || []).map((task: any) => task.id || task._id);
      let allReviews: any[] = [];
      for (const taskId of myTaskIds) {
        const reviewRes = await fetch(`${REVIEW_API_BASE}/api/reviews?taskId=${taskId}`);
        if (reviewRes.ok) {
          const reviews = await reviewRes.json();
          allReviews = allReviews.concat(reviews);
        }
      }
      setReviews(allReviews);
    } catch (err) {
      console.error("Failed to fetch reviews for my tasks:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_PROFILE_API_URL}/api/profile/get`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) throw new Error("Invalid response format");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
        setProfile(data);
        // Fetch reviews for this user's tasks
        if (data.ID) {
          fetchReviewsForMyTasks(data.ID);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const fetchReviewerName = async (reviewerId: string) => {
    if (reviewerNames[reviewerId]) return reviewerNames[reviewerId];
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8084';
      const res = await fetch(`${API_BASE_URL}/api/auth/user/${reviewerId}`);
      if (res.ok) {
        const data = await res.json();
        const name = data.Name || data.name || data.fullName || 'Unknown';
        setReviewerNames(prev => ({ ...prev, [reviewerId]: name }));
        return name;
      }
    } catch (err) {
      console.error('Failed to fetch reviewer name:', err);
    }
    setReviewerNames(prev => ({ ...prev, [reviewerId]: 'Unknown' }));
    return 'Unknown';
  };

  useEffect(() => {
    if (reviews.length > 0) {
      reviews.forEach((review) => {
        if (review.reviewerId && !reviewerNames[review.reviewerId]) {
          fetchReviewerName(review.reviewerId);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews]);

  if (loading || !profile) return null;

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-white text-black flex flex-col gap-6 p-6">
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-[1400px] mx-auto">
          {/* Left: Profile Card */}
          <div className="w-full md:w-1/4 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-6 shadow-xl">
            <div className="flex flex-col items-center gap-2">
              <Image src="/categories-banner.png" alt="User" width={96} height={96} className="rounded-full border-4 border-white object-cover w-24 h-24" />
              <h2 className="text-xl font-bold mt-2 text-center">{profile.Name || 'TradeMinutes User'}</h2>
              <div className="text-xs text-gray-500 text-center">Marketplace Member</div>
              <div className="text-xs text-gray-500 text-center">User ID: TM-{profile.Email?.split('@')[0]}</div>
              <button className="mt-2 px-4 py-1 rounded-full bg-[#6c63ff] text-white font-semibold text-sm hover:bg-[#554ee1] transition">Edit</button>
            </div>
            <div className="text-sm text-gray-700">
              
              <div className="mb-2 flex items-center gap-2"><span className="font-semibold">Email:</span> <span className="text-gray-500">{profile.Email}</span></div>
              {profile.College && (
                <div className="mb-2 flex items-center gap-2"><span className="font-semibold">College:</span> <span className="text-gray-500">{profile.College}</span></div>
              )}
              {profile.Program && (
                <div className="mb-2 flex items-center gap-2"><span className="font-semibold">Program:</span> <span className="text-gray-500">{profile.Program}</span></div>
              )}
              {profile.YearOfStudy && (
                <div className="mb-2 flex items-center gap-2"><span className="font-semibold">Year of Study:</span> <span className="text-gray-500">{profile.YearOfStudy}</span></div>
              )}
              <div className="mb-2 flex items-center gap-2"><span className="font-semibold">Skills:</span>
                {profile.Skills && profile.Skills.length > 0 ? (
                  <span className="flex flex-wrap gap-2">
                    {profile.Skills.map((skill, idx) => (
                      <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold border border-green-300">{skill}</span>
                    ))}
                  </span>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </div>
            </div>
            {/* Calendar-style schedule */}
            <div>
              <h3 className="font-semibold mb-2 text-[#6c63ff]">Today's Tasks</h3>
              <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
                <div className="flex gap-2">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
                <span className="text-[#6c63ff] font-bold">13</span>
              </div>
              <div className="flex flex-col gap-2">
                {/* Example TradeMinutes tasks */}
                <div className="flex items-center justify-between bg-[#f6f7fb] rounded-lg px-3 py-2">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-[#6c63ff]">10:00 AM - 11:00 AM</span>
                    <span className="text-xs text-gray-500">John Doe</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-[#6c63ff]">Dog Walking</span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#e0e7ff] text-[#6c63ff]">Completed</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-[#f6f7fb] rounded-lg px-3 py-2">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-[#6c63ff]">11:30 AM - 12:30 PM</span>
                    <span className="text-xs text-gray-500">Jane Smith</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-[#6c63ff]">Math Tutoring</span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#fff4e5] text-[#ff9800]">Pending</span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-[#f6f7fb] rounded-lg px-3 py-2">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-[#6c63ff]">2:00 PM - 3:00 PM</span>
                    <span className="text-xs text-gray-500">Alex Lee</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-[#6c63ff]">PC Setup</span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#e0f7fa] text-[#00bcd4]">Ongoing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Center: Stats + About + Experience */}
          <div className="w-full md:w-2/4 flex flex-col gap-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* TradeMinutes stats */}
              <div className="bg-white rounded-xl p-4 flex flex-col items-center shadow-xl">
                <span className="text-2xl font-bold text-[#6c63ff]">{profile.Credits ?? 0}</span>
                <span className="text-xs text-gray-500 mt-1 text-center">Credits</span>
              </div>
              <div className="bg-white rounded-xl p-4 flex flex-col items-center shadow-xl">
                <span className="text-2xl font-bold text-[#6c63ff]">12</span>
                <span className="text-xs text-gray-500 mt-1 text-center">Tasks Completed</span>
              </div>
              <div className="bg-white rounded-xl p-4 flex flex-col items-center shadow-xl">
                <span className="text-2xl font-bold text-[#6c63ff]">4.9 / 5</span>
                <span className="text-xs text-gray-500 mt-1 text-center">Avg. Rating</span>
              </div>
              <div className="bg-white rounded-xl p-4 flex flex-col items-center shadow-xl">
                <span className="text-2xl font-bold text-[#6c63ff]">3</span>
                <span className="text-xs text-gray-500 mt-1 text-center">Active Listings</span>
              </div>
              <div className="bg-white rounded-xl p-4 flex flex-col items-center shadow-xl">
                <span className="text-2xl font-bold text-[#6c63ff]">5</span>
                <span className="text-xs text-gray-500 mt-1 text-center">Upcoming Tasks</span>
              </div>
            </div>
            {/* About/Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-2 text-[#6c63ff]">About</h3>
              <div className="mb-4">
                <h4 className="font-semibold text-[#6c63ff] mb-1">Description</h4>
                <p className="text-gray-700">Welcome to TradeMinutes! TradeMinutes is a modern service marketplace where you can offer, discover, and book a wide range of services—from tutoring and tech help to pet care and more. Earn credits by completing tasks, grow your reputation, and connect with a vibrant community of users.</p>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-[#6c63ff] mb-1">How It Works</h4>
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm"><span className="inline-block w-2 h-2 bg-[#6c63ff] rounded-full"></span> Browse or list services in dozens of categories</span>
                  <span className="flex items-center gap-2 text-sm"><span className="inline-block w-2 h-2 bg-[#6c63ff] rounded-full"></span> Book appointments and manage your schedule</span>
                  <span className="flex items-center gap-2 text-sm"><span className="inline-block w-2 h-2 bg-[#6c63ff] rounded-full"></span> Earn and spend credits for every transaction</span>
                </div>
              </div>
              <div className="mb-4">
                <h4 className="font-semibold text-[#6c63ff] mb-1">Your Achievements</h4>
                <ul className="list-disc ml-6 text-sm text-gray-700">
                  <li>Completed 12 tasks in 3 different categories</li>
                  <li>Maintained a 4.9/5 average rating from 8 reviews</li>
                  <li>Earned 100+ credits through service excellence</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-[#6c63ff] mb-1">Badges</h4>
                <ul className="list-disc ml-6 text-sm text-gray-700">
                  <li>Top Tasker</li>
                  <li>Trusted Seller</li>
                  <li>Community Helper</li>
                </ul>
              </div>
            </div>
          </div>
          {/* Right: Reviews/Feedback */}
          <div className="w-full md:w-1/4 flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-2 text-[#6c63ff]">User Reviews</h3>
              <div className="flex flex-col gap-4">
                {reviewsLoading ? (
                  <div className="text-center text-gray-500">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                  <div className="text-center text-gray-500">No reviews yet</div>
                ) : (
                  reviews.map((review, index) => (
                    <div key={review.id || index} className="flex gap-3 items-start border-b border-gray-100 pb-3 last:border-b-0">
                      <Image 
                        src="https://randomuser.me/api/portraits/men/32.jpg" 
                        alt="Reviewer" 
                        width={36} 
                        height={36} 
                        className="rounded-full w-9 h-9 object-cover" 
                      />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#6c63ff]">{reviewerNames[review.reviewerId] || 'Reviewer'}</span>
                          <span className="text-xs text-gray-400">
                            {review.createdAt ? new Date(review.createdAt * 1000).toLocaleDateString() : 'Unknown date'}
                          </span>
                    </div>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={star <= review.rating ? "text-yellow-400" : "text-gray-300"}>
                              ★
                            </span>
                          ))}
                    </div>
                        <p className="text-sm text-gray-700 mt-2">{review.comment || 'No comment'}</p>
                </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
