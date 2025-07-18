"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FaCheckCircle } from 'react-icons/fa';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );
      const data = await res.text();
      if (!res.ok) {
        throw new Error(data || "Registration failed");
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen flex flex-col md:flex-row relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 bg-white/80 rounded-xl px-8 py-8 shadow-xl min-w-[260px]">
              <svg className="animate-spin text-4xl text-[#22c55e]" width="32" height="32" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="4" /><path className="opacity-75" fill="#22c55e" d="M4 12a8 8 0 018-8v8z" /></svg>
              <span className="text-lg font-semibold text-[#1a1446]">Registering...</span>
            </div>
          </div>
        )}
        {/* Left: Register Form */}
        <div className={`flex flex-col justify-center items-center w-full md:w-1/2 min-h-screen px-6 py-12 bg-white relative transition-all duration-200 ${loading || success ? 'blur-sm pointer-events-none select-none' : ''}`}>
          <div className="w-full max-w-md flex flex-col items-center">
            <h2 className="text-3xl font-bold text-[#1a1446] mb-2 w-full text-left">Create your TradeMinutes account</h2>
            <p className="text-gray-500 mb-8 w-full text-left">Join the community and start exchanging skills for time credits!</p>
            {/* Error and Success Messages */}
            {error && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleRegister} className="space-y-5 w-full">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-[#1a1446]">Full Name<span className="text-[#22c55e]">*</span></label>
                <div className="flex items-center bg-white rounded-full border border-gray-200 px-5 py-3 focus-within:border-[#22c55e]">
                  <FiUser className="text-xl text-[#22c55e] mr-3" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-[#1a1446] placeholder-gray-400 text-base"
                    required
                    disabled={loading || success}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1 text-[#1a1446]">Email Address<span className="text-[#22c55e]">*</span></label>
                <div className="flex items-center bg-white rounded-full border border-gray-200 px-5 py-3 focus-within:border-[#22c55e]">
                  <FiMail className="text-xl text-[#22c55e] mr-3" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-[#1a1446] placeholder-gray-400 text-base"
                    required
                    disabled={loading || success}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1 text-[#1a1446]">Password<span className="text-[#22c55e]">*</span></label>
                <div className="flex items-center bg-white rounded-full border border-gray-200 px-5 py-3 focus-within:border-[#22c55e]">
                  <FiLock className="text-xl text-[#22c55e] mr-3" />
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-[#1a1446] placeholder-gray-400 text-base"
                    required
                    disabled={loading || success}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || success}
                className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold rounded-full py-3 mt-2 transition-colors duration-150 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
            <p className="text-center text-sm mt-8 text-[#1a1446]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="text-[#22c55e] hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
          <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-400">©2024 TradeMinutes. All rights reserved.</div>
        </div>
        {/* Right: Modern Dashboard Card */}
        <div className={`hidden md:flex flex-1 items-stretch min-h-screen bg-gradient-to-br from-[#22c55e] via-[#16a34a] to-[#134e2f] relative overflow-hidden transition-all duration-200 ${loading || success ? 'blur-sm pointer-events-none select-none' : ''}`}>
          {/* Logo at the top */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
            <div className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">TradeMinutes</div>
          </div>
          {/* Geometric pattern top right */}
          <div className="absolute top-0 right-0 z-10 p-8">
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
              {[0,1,2,3].map((row) => (
                [0,1,2,3].map((col) => (
                  <polygon key={row+','+col} points={`${col*30},${row*20} ${col*30+20},${row*20} ${col*30+20},${row*20+20}`} fill="#16a34a" fillOpacity="0.18" />
                ))
              ))}
            </svg>
          </div>
          {/* Floating dashboard card */}
          <div className="flex-1 flex flex-col items-center justify-center relative z-20">
            <div className="relative bg-white rounded-2xl shadow-2xl px-14 py-12 min-w-[480px] max-w-2xl flex flex-col items-center gap-6">
              {/* Stat overlays */}
              <div className="absolute -top-8 left-10 bg-white rounded-xl shadow-md px-6 py-3 flex flex-col items-center border border-gray-100">
                <span className="text-xs text-gray-400">TIME CREDITS</span>
                <span className="text-2xl font-bold text-[#22c55e]">1,723</span>
              </div>
              <div className="absolute -bottom-8 right-10 bg-white rounded-xl shadow-md px-6 py-3 flex flex-col items-center border border-gray-100">
                <span className="text-xs text-gray-400">TASKS</span>
                <span className="text-2xl font-bold text-[#22c55e]">32</span>
              </div>
              {/* Avatars */}
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="absolute -left-10 top-24 w-16 h-16 rounded-full border-4 border-white shadow-md" />
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="absolute -right-10 top-36 w-16 h-16 rounded-full border-4 border-white shadow-md" />
              {/* Chart */}
              <svg width="400" height="120" viewBox="0 0 400 120" fill="none" className="mb-4">
                <polyline points="0,90 60,70 120,50 180,30 240,50 300,70 360,60" fill="none" stroke="#22c55e" strokeWidth="6" />
                <circle cx="240" cy="50" r="10" fill="#22c55e" />
                <circle cx="300" cy="70" r="10" fill="#22c55e" />
              </svg>
              <div className="flex justify-between w-full text-base text-gray-400 mb-4">
                <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span>
              </div>
              {/* Reports/Stats */}
              <div className="flex flex-col items-center w-full">
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-semibold text-[#1a1446] text-lg">Overview</span>
                  <span className="text-base text-gray-400">+22%</span>
                </div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-base text-gray-500">Community</span>
                  <span className="text-base text-[#22c55e] font-bold">837,282</span>
                </div>
              </div>
            </div>
          </div>
          {/* Headline and subtitle at the bottom */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center w-full px-4">
            <div className="text-2xl font-bold text-white mb-2">Welcome to TradeMinutes</div>
            <div className="text-white text-opacity-80">Track your time credits, connect with the community, and discover new skills to exchange!</div>
          </div>
        </div>
      </main>
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl px-8 py-8 flex flex-col items-center gap-4 min-w-[320px] max-w-[90vw]">
            <FaCheckCircle className="text-4xl text-green-500 mb-2" />
            <div className="text-lg font-semibold text-[#1a1446] text-center">Registration successful!</div>
            <div className="text-gray-600 text-center">You will be redirected to the login page.</div>
          </div>
        </div>
      )}
    </>
  );
}