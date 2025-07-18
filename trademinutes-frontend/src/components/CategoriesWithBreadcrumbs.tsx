'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = [
  'All Categories',
  'Household Help',
  'Tutoring & Study',
  'Tech Help',
  'Fitness & Wellness',
  'Pet Care',
  'Elderly Assistance',
  'Errand Running',
  'Creative Services',
  'Volunteering',
];

export default function CategoryTabsWithBreadcrumb() {
  const [active, setActive] = useState('All Categories');

  return (
    <div className="border-b border-gray-100 pb-2">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-6 overflow-x-auto px-4 md:px-10 whitespace-nowrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`pb-2 text-sm font-medium transition-colors ${
                active === cat ? 'text-black border-b-2 border-black' : 'text-gray-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Breadcrumb */}
        <div className="px-4 md:px-10 mt-6 text-sm text-gray-500 space-x-2 ">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:underline">Browser Jobs</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{active}</span>
        </div>
      </div>
    </div>
  );
}
