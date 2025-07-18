'use client';

import Image from 'next/image';

const verifiedHelpers = [
  {
    name: 'Marvin McKinney',
    role: 'Meal Prep Coach',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Ralph Edwards',
    role: 'Tech Support Volunteer',
    avatar: 'https://randomuser.me/api/portraits/men/47.jpg',
  },
  {
    name: 'Annette Black',
    role: 'Homework Tutor',
    avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
  },
  {
    name: 'Jane Cooper',
    role: 'Pet Care Specialist',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
];

export default function TrustedHelpersSection() {
  return (
    <section className="bg-[#EBF8F6] py-20 rounded-3xl px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 items-center">
        {/* Left - Verified Helpers */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-sm font-semibold text-emerald-600 mb-4">
            200+ Verified Helpers
          </h3>
          <ul className="space-y-4">
            {verifiedHelpers.map((user, i) => (
              <li key={i} className="flex items-center gap-3">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Center - Featured User Card */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Image
                src="https://randomuser.me/api/portraits/women/12.jpg"
                alt="Kristin Watson"
                width={72}
                height={72}
                className="rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
            </div>

            <h4 className="font-semibold mt-4">Kristin Watson</h4>
            <p className="text-sm text-gray-500">Dog Walking & Care</p>
            <p className="text-sm text-yellow-500 mt-1">
              ⭐ 4.9 <span className="text-gray-400">(198 reviews)</span>
            </p>

            <div className="flex flex-wrap justify-center gap-2 my-4">
              {['Dog Walking', 'Pet Sitting', 'Training'].map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-3 py-1 bg-pink-100 text-gray-700 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex justify-between w-full border-t pt-4 text-xs text-gray-600">
              <div>
                <p className="text-gray-400">Location</p>
                <p>Toronto</p>
              </div>
              <div>
                <p className="text-gray-400">Rate</p>
                <p>30 credits / hr</p>
              </div>
              <div>
                <p className="text-gray-400">Job Success</p>
                <p>97%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Description + CTA */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Trusted by the TradeMinutes Community</h2>
          <p className="text-sm text-gray-600 mb-6">
            Our members are skilled, reliable, and reviewed by real neighbors. Each hour earned or
            spent builds local trust — and lasting impact.
          </p>

          <ul className="space-y-3 text-sm text-gray-700 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">✔️</span> Time-based exchange. No money involved.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">✔️</span> 1,000+ hours exchanged across categories
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">✔️</span> Verified profiles with ratings and skills
            </li>
          </ul>

          <button className="bg-emerald-700 text-white px-6 py-3 rounded-md text-sm hover:bg-emerald-800 transition">
            Meet Helpers ↗
          </button>
        </div>
      </div>
    </section>
  );
}
