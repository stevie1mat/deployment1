"use client";

import { useEffect, useState } from "react";
import ParticlesBackground from "./ParticlesBackground";

const images = [
    "https://images.pexels.com/photos/6457565/pexels-photo-6457565.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  

];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
   <section
  className="relative min-h-[100vh] flex items-center justify-center bg-cover bg-center transition-all duration-1000"
  style={{
    backgroundImage: `url(${images[current]})`,
  }}
>
  {/* Particle Layer */}
  <div className="absolute inset-0 z-0 overflow-hidden">
    <ParticlesBackground />
  </div>
    <div className="absolute inset-0 bg-black/40 z-0" />
     <div className="relative z-10 text-center px-4 text-white max-w-6xl">
  <h1 className="text-4xl md:text-5xl font-bold mb-4">
    Exchange Skills. Earn Time Credits.
  </h1>
  <p className="mb-6">
    TradeMinutes lets you help others and get help in return — no money involved, just your time.
  </p>

  <div className="bg-white rounded-lg shadow-lg flex items-center overflow-hidden w-full max-w-6xl mx-auto">

  {/* Search Icon + Input */}
  <div className="flex items-center px-6 py-4 w-full md:w-[50%]">
    <svg className="w-6 h-6 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
    </svg>
    <input
      type="text"
      placeholder="Search For Help or Services"
      className="w-full text-lg text-black outline-none placeholder-gray-500"
    />
  </div>

  {/* Divider */}
  <div className="w-px h-12 bg-gray-300" />

  {/* Dropdown */}
  <div className="px-6 py-4 w-full md:w-[30%]">
    <select className="w-full text-lg py-3 bg-white text-black outline-none">
      <option>Category</option>
      <option>Cooking</option>
      <option>Web Design</option>
      <option>Fitness Coaching</option>
      <option>Tutoring</option>
    </select>
  </div>

  {/* Button */}
  <button className="bg-green-500 text-white text-lg font-semibold px-13 py-8 hover:bg-green-600 rounded-r-lg">
    Search
  </button>
</div>


  <p className="text-sm mt-4 text-gray-200">
    Popular: Gardening, Dog Walking, Coding Help, Resume Review, Piano Lessons
  </p>
</div>

    </section>
  );
}
