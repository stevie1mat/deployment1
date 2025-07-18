'use client';

import {
  FiAward,
  FiUserCheck,
  FiShield,
} from 'react-icons/fi';
import Image from 'next/image';
import CountUp from 'react-countup';

const features = [
  {
    icon: <FiAward size={24} className="text-emerald-700" />,
    title: 'Verified Community Skills',
    desc: 'See real reviews and completed tasks before exchanging help with anyone.',
  },
  {
    icon: <FiUserCheck size={24} className="text-emerald-700" />,
    title: 'Time is the Only Currency',
    desc: 'You earn time credits by helping others — and spend them when you need help.',
  },
  {
    icon: <FiShield size={24} className="text-emerald-700" />,
    title: 'Trusted & Supportive',
    desc: 'We protect your privacy and help you build trust-based connections nearby.',
  },
];

export default function WhyTradeMinutes() {
  return (
    <section className="bg-white py-20 px-4">
     <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-0 items-stretch overflow-hidden rounded-lg">
  {/* Left Content */}
 <div className="bg-[#FAF6ED] p-10 pl-20 pr-20 pt-20 pb-20 flex flex-col justify-center h-full">
    <h2 className="text-3xl font-semibold mb-10">
      A whole new way to give & receive help in your community
    </h2>

    <ul className="space-y-6">
      {features.map((item, index) => (
        <li key={index} className="flex items-start gap-4">
          <div className="mt-1">{item.icon}</div>
          <div>
            <h4 className="font-semibold text-gray-800">{item.title}</h4>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>

  {/* Right Image */}
  <div className="h-full">
    <Image
      src="https://images.pexels.com/photos/3791664/pexels-photo-3791664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      alt="Community help"
      width={800}
      height={600}
      className="w-full h-full object-cover"
    />
  </div>
</div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 text-center gap-8 max-w-4xl mx-auto">
  <div>
    <h3 className="text-2xl font-bold text-gray-900">
      <CountUp end={12500} duration={2} separator="," />+
    </h3>
    <p className="text-sm text-gray-500">Total Members</p>
  </div>
  <div>
    <h3 className="text-2xl font-bold text-gray-900">
      <CountUp end={48300} duration={2.5} separator="," />+
    </h3>
    <p className="text-sm text-gray-500">Hours Exchanged</p>
  </div>
  <div>
    <h3 className="text-2xl font-bold text-gray-900">
      <CountUp end={97} duration={1.5} suffix="%" />
    </h3>
    <p className="text-sm text-gray-500">Satisfaction Rate</p>
  </div>
  <div>
    <h3 className="text-2xl font-bold text-gray-900">
      <CountUp end={21000} duration={2} separator="," />+
    </h3>
    <p className="text-sm text-gray-500">Tasks Completed</p>
  </div>
</div>
    </section>
  );
}
