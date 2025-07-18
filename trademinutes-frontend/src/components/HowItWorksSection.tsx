'use client';

import {
  FiPlusCircle,
  FiSearch,
  FiClock,
  FiSmile,
} from 'react-icons/fi';

const steps = [
  {
    icon: <FiPlusCircle size={32} />,
    title: 'Offer or Request Help',
    desc: 'Post a task you need done or offer a skill you can share with the community.',
  },
  {
    icon: <FiSearch size={32} />,
    title: 'Discover Trusted Neighbors',
    desc: 'Browse skills offered nearby and choose people with positive reviews.',
  },
  {
    icon: <FiClock size={32} />,
    title: 'Earn or Spend Time Credits',
    desc: 'For every hour you help, you earn an hour to use when you need support.',
  },
  {
    icon: <FiSmile size={32} />,
    title: 'Grow Together',
    desc: 'Build connections, save money, and make your community stronger.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-2">How TradeMinutes Works</h2>
        <p className="text-gray-500 mb-12">
          Exchange time, not money — it’s simple, fair, and community-powered.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {steps.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="text-emerald-800 mb-4">{item.icon}</div>
              <h3 className="text-lg font-medium mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 max-w-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
