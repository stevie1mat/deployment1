"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Testimonials from '@/components/Testimonials';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF, FaApple, FaGithub, FaCheckCircle } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    } else {
      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#22c55e] border-solid"></div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoginSuccess(false);
    setLoading(true);
    
    try {
      const authUrl = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8080';
      console.log('🔗 Attempting login to:', `${authUrl}/api/auth/login`);
      
      const res = await fetch(
        `${authUrl}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      
      console.log('📡 Response status:', res.status);
      console.log('📡 Response headers:', Object.fromEntries(res.headers.entries()));
      
      const contentType = res.headers.get("content-type") || "";
      console.log('📡 Content-Type:', contentType);
      
      if (!res.ok) {
        const errorText = contentType.includes("application/json")
          ? (await res.json()).error || "Login failed"
          : await res.text();
        console.error('❌ Login failed:', errorText);
        throw new Error(errorText);
      }
      
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error('❌ Unexpected response format:', text);
        throw new Error("Unexpected response format from server");
      }
      
      const data = await res.json();
      console.log('✅ Login successful, token received:', !!data.token);
      
      if (data.token) {
        localStorage.setItem("token", data.token);
        setLoginSuccess(true);
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        throw new Error("No token received from server");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      console.error('❌ Login error:', err);
      setError(message);
    } finally {
      if (!loginSuccess) setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row relative">
      {/* Loading Overlay */}
      {(loading || loginSuccess) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 bg-white/80 rounded-xl px-8 py-8 shadow-xl min-w-[260px]">
            {!loginSuccess ? (
              <>
                <ImSpinner2 className="animate-spin text-4xl text-[#22c55e]" />
                <span className="text-lg font-semibold text-[#1a1446]">Logging in...</span>
              </>
            ) : (
              <>
                <FaCheckCircle className="text-5xl text-[#22c55e] animate-pop" />
                <span className="text-lg font-semibold text-[#22c55e]">Login successful!</span>
              </>
            )}
          </div>
        </div>
      )}
      {/* Left: Login Form */}
      <div className={`flex flex-col justify-center items-center w-full md:w-1/2 min-h-screen px-6 py-12 bg-white relative transition-all duration-200 ${loading || loginSuccess ? 'blur-sm pointer-events-none select-none' : ''}`}>
        {/* Logo */}
        {/* <div className="mb-8">
          <div className="text-2xl font-bold text-[#22c55e]">TradeMinutes</div>
        </div> */}
        <div className="w-full max-w-md flex flex-col items-center">
          <h2 className="text-3xl font-bold text-[#1a1446] mb-2 w-full text-left">Login to TradeMinutes</h2>
          <p className="text-gray-500 mb-8 w-full text-left">Connect with your community and exchange skills for time credits!</p>
          
          {/* Error and Success Messages */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <button
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-full py-3 bg-white hover:bg-gray-50 transition-colors text-[#1a1446] font-medium text-lg mb-4"
          >
            <FaGithub className="text-2xl" /> Sign in with GitHub
          </button>
          <div className="flex items-center w-full my-2">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="px-3 text-gray-400 text-sm">or Sign in with Email</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
          <form onSubmit={handleLogin} className="space-y-5 w-full">
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
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-[#1a1446]">Password<span className="text-[#22c55e]">*</span></label>
              <div className="flex items-center bg-white rounded-full border border-gray-200 px-5 py-3 focus-within:border-[#22c55e]">
                <FiLock className="text-xl text-[#22c55e] mr-3" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-[#1a1446] placeholder-gray-400 text-base"
                  required
                  disabled={loading}
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword(v => !v)} className="ml-2 text-gray-400 hover:text-[#22c55e] focus:outline-none">
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center text-sm text-[#1a1446]">
                <input type="checkbox" className="mr-2 accent-[#22c55e]" /> Remember me
              </label>
              <button
                type="button"
                onClick={() => router.push('/forgot-password')}
                className="text-sm text-[#22c55e] hover:underline font-medium"
                tabIndex={-1}
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold rounded-full py-3 mt-2 transition-colors duration-150 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login to TradeMinutes"}
            </button>
          </form>
          <p className="text-center text-sm mt-8 text-[#1a1446]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-[#22c55e] hover:underline font-medium"
            >
              Sign up for TradeMinutes
            </button>
          </p>
        </div>
        <div className="absolute bottom-4 left-0 w-full text-center text-xs text-gray-400">©2024 TradeMinutes. All rights reserved.</div>
      </div>
      {/* Right: Abstract Illustration & Widgets */}
      <div className={`hidden md:flex flex-1 items-stretch min-h-screen bg-gradient-to-br from-[#22c55e] via-[#16a34a] to-[#134e2f] relative overflow-hidden transition-all duration-200 ${loading || loginSuccess ? 'blur-sm pointer-events-none select-none' : ''}`}>
        {/* Social Icons - left vertical stack */}
        <div className="absolute top-20 left-10 flex flex-col gap-6 z-20">
          <div className="bg-white rounded-full p-3 shadow-lg"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="#1DA1F2"/><path d="M21 10.5c-.5.2-1 .3-1.5.4.5-.3.9-.8 1.1-1.3-.5.3-1 .5-1.6.6-.5-.5-1.2-.8-2-.8-1.5 0-2.7 1.2-2.7 2.7 0 .2 0 .4.1.6-2.2-.1-4.1-1.2-5.4-2.9-.2.4-.3.8-.3 1.2 0 .9.5 1.7 1.2 2.2-.4 0-.7-.1-1-.2v.1c0 1.3.9 2.3 2.1 2.6-.2.1-.4.1-.7.1-.2 0-.3 0-.5-.1.3 1 1.3 1.7 2.4 1.7-1 .8-2.2 1.3-3.5 1.3-.2 0-.4 0-.6-.1 1.2.8 2.6 1.3 4.1 1.3 4.9 0 7.6-4.1 7.6-7.6v-.3c.5-.3.9-.8 1.2-1.3z" fill="#fff"/></svg></div>
          <div className="bg-white rounded-full p-3 shadow-lg"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="#E1306C"/><path d="M19.5 9.5a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-7zm-5.5 1.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm4.5-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-1.5 3a2 2 0 1 0-4 0 2 2 0 0 0 4 0z" fill="#fff"/></svg></div>
          <div className="bg-white rounded-full p-3 shadow-lg"><svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="14" fill="#22c55e"/><path d="M19.5 10.5c-.2-.5-.5-.8-1-.8h-9c-.5 0-.8.3-1 .8-.2.5-.2 1.2 0 1.7l4.5 7.8c.2.3.5.5.8.5s.6-.2.8-.5l4.5-7.8c.2-.5.2-1.2 0-1.7z" fill="#fff"/></svg></div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
          {/* Chart Widget - upper center */}
          <div className="absolute top-64 left-80 -translate-x-1/2 bg-white rounded-xl shadow-lg px-8 py-6 min-w-[320px] max-w-xs">
            <div className="text-xs text-gray-400 mb-2">48,300+ Hours Exchanged</div>
            <svg width="220" height="60" viewBox="0 0 220 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="0,50 40,40 80,30 120,20 160,30 200,40 220,35" fill="none" stroke="#22c55e" strokeWidth="3" />
              <circle cx="160" cy="30" r="4" fill="#22c55e" />
              <circle cx="200" cy="40" r="4" fill="#22c55e" />
            </svg>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span>
            </div>
          </div>
          {/* Rewards Widget - top right of chart, spaced */}
          <div className="absolute top-40 right-24 bg-white rounded-xl shadow-lg px-8 py-6 min-w-[200px] max-w-xs flex flex-col items-center">
            <div className="text-lg font-semibold text-[#1a1446] mb-2">Time Credits</div>
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-16 h-16 rounded-full border-4 border-[#22c55e] mb-2" />
            <div className="text-xs text-gray-400">Available</div>
            <div className="text-2xl font-bold text-[#22c55e]">24.5 hrs</div>
          </div>
          {/* Services Widget - below rewards, spaced */}
          <div className="absolute top-104 right-24 bg-white rounded-xl shadow-lg px-6 py-5 min-w-[180px] max-w-xs flex flex-col items-start gap-3">
            <div className="text-base font-semibold text-[#1a1446] mb-1">Popular Skills</div>
            <div className="flex items-center gap-2 text-sm text-gray-700"><span className="inline-block w-3 h-3 rounded-full bg-[#22c55e]"></span> Math Tutoring</div>
            <div className="flex items-center gap-2 text-sm text-gray-700"><span className="inline-block w-3 h-3 rounded-full bg-[#22c55e]"></span> Computer Help</div>
            <div className="flex items-center gap-2 text-sm text-gray-700"><span className="inline-block w-3 h-3 rounded-full bg-[#22c55e]"></span> Dog Walking</div>
            <div className="flex items-center gap-2 text-sm text-gray-700"><span className="inline-block w-3 h-3 rounded-full bg-[#22c55e]"></span> Yoga Classes</div>
          </div>
          {/* Reviews Widget - lower, spaced */}
          <div className="absolute bottom-64 left-1/4 bg-white rounded-xl shadow-lg px-6 py-5 min-w-[320px] max-w-xs flex flex-col items-start">
            <div className="flex items-center gap-2 mb-2">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Reviewer" className="w-8 h-8 rounded-full" />
              <span className="font-semibold text-[#1a1446] text-sm">Sarah K.</span>
              <span className="flex gap-0.5 ml-2">
                {[...Array(5)].map((_,i) => <svg key={i} width="14" height="14" fill="#22c55e" viewBox="0 0 20 20"><polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7"/></svg>)}
              </span>
            </div>
            <div className="text-xs text-gray-600 mb-1">"TradeMinutes helped me find a math tutor in minutes. The time credit system is brilliant!"</div>
            <div className="text-xs text-gray-400">2 days ago</div>
          </div>
         
          {/* Headline and subtitle - bottom center */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
            <div className="text-2xl font-bold text-white mb-2">Exchange skills, build community.</div>
            <div className="text-white text-opacity-70">Join thousands of members helping each other with time-based exchanges.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
