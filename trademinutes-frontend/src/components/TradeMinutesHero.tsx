'use client';

import Image from 'next/image';

export default function TradeMinutesHero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <Image
            src="https://cdn.pixabay.com/photo/2018/03/23/23/17/portrait-3255254_1280.jpg"
            alt="Community Member 1"
            width={300}
            height={300}
            className="rounded-xl object-cover w-full h-auto"
          />
          <Image
            src="https://cdn.pixabay.com/photo/2016/09/24/03/20/man-1690965_1280.jpg"
            alt="Community Member 2"
            width={300}
            height={300}
            className="rounded-xl object-cover w-full h-auto"
          />
        </div>
        <div className="space-y-4 pt-10">
          <Image
            src="https://cdn.pixabay.com/photo/2023/02/08/06/33/fashion-7775827_1280.jpg"
            alt="Community Member 3"
            width={300}
            height={300}
            className="rounded-xl object-cover w-full h-auto"
          />
          <Image
            src="https://cdn.pixabay.com/photo/2018/01/16/10/29/man-3085702_1280.jpg"
            alt="Community Member 4"
            width={300}
            height={300}
            className="rounded-xl object-cover w-full h-auto"
          />
        </div>
      </div>

      {/* Text Content */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-gray-900">
          Join TradeMinutes — <br /> The Skills-for-Time Marketplace
        </h2>
        <p className="text-gray-600 mb-6 max-w-md text-sm">
          TradeMinutes is your local community hub where services are exchanged using time credits —
          not money. Find helpers, tutors, fixers, and creatives right around the corner.
        </p>
        <ul className="text-gray-700 space-y-3 mb-8 text-sm">
          <li className="flex items-start gap-2">✅ Exchange time, not cash — earn and spend credits</li>
          <li className="flex items-start gap-2">✅ Connect with trusted members near you</li>
          <li className="flex items-start gap-2">✅ Access real skills: tutoring, tech help, repairs, care</li>
        </ul>
        <button className="bg-emerald-100 text-emerald-800 text-sm px-6 py-3 rounded-md font-medium hover:bg-emerald-200 transition">
          Get Started ↗
        </button>
      </div>
    </section>
  );
}
