"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiArrowRight } from 'react-icons/fi';
import { FaCheckCircle, FaGithub } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const authUrl = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8080';
      const res = await fetch(
        `${authUrl}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const text = await res.text();
      if (!res.ok) {
        throw new Error(text || "Failed to send reset link");
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      if (!success) setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row relative">
      {/* Loading Overlay */}
      {(loading || success) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 bg-white/80 rounded-xl px-8 py-8 shadow-xl min-w-[260px]">
            {!success ? (
              <>
                <ImSpinner2 className="animate-spin text-4xl text-[#22c55e]" />
                <span className="text-lg font-semibold text-[#1a1446]">Sending reset link...</span>
              </>
            ) : (
              <>
                <FaCheckCircle className="text-5xl text-[#22c55e] animate-pop" />
                <span className="text-lg font-semibold text-[#22c55e]">Email sent!</span>
              </>
            )}
          </div>
        </div>
      )}
      {/* Left: Forgot Password Form */}
      <div className={`flex flex-col justify-center items-center w-full md:w-1/2 min-h-screen px-6 py-12 bg-white relative transition-all duration-200 ${loading || success ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <div className="w-full max-w-md flex flex-col items-center">
          <h2 className="text-3xl font-bold text-[#1a1446] mb-2 w-full text-left">Forgot Password</h2>
          <p className="text-gray-500 mb-8 w-full text-left">Enter your email to receive a password reset link.</p>
          {/* Error Message */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleForgotPassword} className="space-y-5 w-full">
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
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold rounded-full py-3 mt-2 transition-colors duration-150 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <p className="text-center text-sm mt-8 text-[#1a1446]">
            Remembered your password?{' '}
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-[#22c55e] hover:underline font-medium"
            >
              Log in
            </button>
          </p>
        </div>
        <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-400">©2024 TradeMinutes. All rights reserved.</div>
      </div>
      {/* Right: Abstract Illustration & Widgets */}
      <div className={`hidden md:flex flex-1 items-stretch min-h-screen bg-gradient-to-br from-[#22c55e] via-[#16a34a] to-[#134e2f] relative overflow-hidden transition-all duration-200 ${loading || success ? 'blur-sm pointer-events-none select-none' : ''}`}>
        {/* Logo at the top */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <div className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">TradeMinutes</div>
        </div>
        {/* Padlock illustration and message */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-6 mt-8 mb-8">
            {/* Padlock SVG */}
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="30" y="55" width="60" height="45" rx="12" fill="#fff" stroke="#22c55e" strokeWidth="4"/>
              <rect x="45" y="35" width="30" height="30" rx="15" fill="#22c55e" stroke="#134e2f" strokeWidth="4"/>
              <rect x="52" y="80" width="16" height="18" rx="8" fill="#22c55e" stroke="#134e2f" strokeWidth="2"/>
              <circle cx="60" cy="89" r="4" fill="#fff" />
            </svg>
            <div className="text-2xl font-bold text-white text-center drop-shadow-lg">We'll help you get back in!</div>
            <div className="text-white text-opacity-80 text-center max-w-xs">Reset your password securely and rejoin the TradeMinutes community.</div>
          </div>
          {/* Password tip widget at the bottom */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 min-w-[260px]">
            <div className="text-[#bbf7d0] font-semibold flex items-center gap-2"><FiArrowRight /> Password Tip</div>
            <div className="text-sm text-[#f0fdf4] text-center">Use a unique password with a mix of letters, numbers, and symbols for better security.</div>
          </div>
        </div>
      </div>
    </main>
  );
}