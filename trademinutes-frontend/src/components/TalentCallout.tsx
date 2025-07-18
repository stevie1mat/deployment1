"use client";

import Image from "next/image";

export default function TalentCallout() {
  return (
    <section className="bg-[#FAF6ED] py-20 px-6 md:px-24">
    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center min-h-[30vh] px-6">
  <div className="max-w-6xl">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      Find the right skills in your community
    </h2>
    <p className="text-gray-700 mb-6">
      Post a task or offer help to others. TradeMinutes lets you exchange time, not money.
    </p>
    <button className="bg-[#244034] text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-[#1b302a] transition">
      Get Started →
    </button>
  </div>
</div>

    </section>
  );
}
