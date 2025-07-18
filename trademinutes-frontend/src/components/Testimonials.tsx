'use client';

import { useState } from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import Image from 'next/image';

const testimonials = [
  {
    quote: 'TradeMinutes helped me find someone to walk my dog while I recovered from surgery. It saved me!',
    name: 'Emma Johnson',
    title: 'Single Mom & Nurse, Toronto',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    quote: 'I earned credits by teaching guitar and used them to get help moving furniture. Brilliant system!',
    name: 'Carlos Mendes',
    title: 'Student & Volunteer',
    avatar: 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    quote: 'As a newcomer to Canada, TradeMinutes gave me community, not just support. So grateful.',
    name: 'Ayesha Khan',
    title: 'Community Member',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    quote: 'Babysitting for neighbors earned me hours to fix my laptop. Better than money sometimes.',
    name: 'Jordan Lee',
    title: 'Freelancer & Dad',
    avatar: 'https://images.pexels.com/photos/7447356/pexels-photo-7447356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = testimonials[activeIndex];

  return (
    <section className="py-20 px-4 text-center max-w-4xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-semibold mb-2">Testimonials</h2>
      <p className="text-gray-500 mb-8">
        What real people are saying about TradeMinutes
      </p>

      {/* Quote */}
      <div className="text-emerald-500 text-4xl mb-6">
        <FaQuoteLeft />
      </div>
      <blockquote className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
        “{active.quote}”
      </blockquote>

      {/* Author */}
      <div className="text-center mb-8">
        <p className="font-medium">{active.name}</p>
        <p className="text-sm text-gray-500">{active.title}</p>
      </div>

      {/* Avatars */}
      <div className="flex justify-center gap-4">
        {testimonials.map((t, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
              activeIndex === i
                ? 'border-emerald-500 ring-2 ring-emerald-300'
                : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
            <Image
              src={t.avatar}
              alt={t.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
