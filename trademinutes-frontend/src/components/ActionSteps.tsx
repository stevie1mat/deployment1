"use client";

import {
  FiBriefcase,
  FiUsers,
  FiLock,
  FiHelpCircle,
} from "react-icons/fi";

export default function TradeMinutesActionSteps() {
  return (
    <section className="py-36 px-6 bg-[#FAF6ED] mt-20"> {/* Light background here */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left content */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need something done?
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            TradeMinutes is your go-to platform to swap skills with real people — no money involved.
            Whether you need help or want to offer help, it starts with one click.
          </p>
          <button className="inline-flex items-center bg-emerald-700 text-white px-5 py-3 rounded-lg hover:bg-emerald-800 transition">
            Get Started
            <span className="ml-2">↗</span>
          </button>
        </div>

        {/* Right icons list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map(({ icon, title, desc }, index) => (
            <div key={index} className="flex flex-col items-start space-y-2">
              <div className="bg-grey-600 text-emerald-700 p-3 rounded-full">
                {icon}
              </div>
              <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: <FiBriefcase size={24} />,
    title: "Post a task",
    desc: "Quickly describe the help you need. It’s fast, free, and easy.",
  },
  {
    icon: <FiUsers size={24} />,
    title: "Choose helpers",
    desc: "Browse trusted community members who are ready to help.",
  },
  {
    icon: <FiLock size={24} />,
    title: "Swap securely",
    desc: "Earn and spend time credits — no payments, just fair trades.",
  },
  {
    icon: <FiHelpCircle size={24} />,
    title: "We’re here to help",
    desc: "Need support? Our team is here for you anytime.",
  },
];
