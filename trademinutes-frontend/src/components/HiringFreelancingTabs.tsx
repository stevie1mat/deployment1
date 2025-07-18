'use client';

import { useState } from 'react';

const tabs = [
  {
    key: 'hiring',
    title: 'For Hiring',
    content: {
      heading: 'Hire Trusted Helpers on TradeMinutes',
      description: [
        'Looking for tutoring, tech support, pet care, or home help? TradeMinutes connects you with skilled community members who exchange time — not money.',
        'Post your task, review profiles, and hire with confidence. Every hour you spend is paid with time credits — making it fair, affordable, and local.',
      ],
    },
  },
  {
    key: 'freelancing',
    title: 'For Freelancing',
    content: {
      heading: 'Earn Time Credits by Offering Your Skills',
      description: [
        'Got a skill? From design and yoga to math tutoring and repairs, TradeMinutes lets you list your service and start earning time credits.',
        'Use your credits to get help from others in the network. It’s flexible, community-powered, and a great way to share what you love doing.',
      ],
    },
  },
];

export default function HiringFreelancingTabs() {
  const [activeTab, setActiveTab] = useState('hiring');

  const current = tabs.find((tab) => tab.key === activeTab)!;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-10 mt-10 mb-10">
      {/* Left: Tabs */}
      <div className="flex flex-col space-y-4 text-left border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-lg font-medium transition-all text-left ${
              activeTab === tab.key
                ? 'text-gray-900 border-b-2 md:border-b-0 md:border-l-2 border-emerald-600 pl-1'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Right: Content */}
      <div className="md:col-span-2">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
          {current.content.heading}
        </h2>
        {current.content.description.map((para, i) => (
          <p key={i} className="text-sm text-gray-600 mb-4 leading-relaxed">
            {para}
          </p>
        ))}

        <button className="mt-4 inline-flex items-center gap-2 border border-emerald-600 text-emerald-700 font-medium px-5 py-2 rounded-md hover:bg-emerald-50 transition">
          Get Started ↗
        </button>
      </div>
    </section>
  );
}
