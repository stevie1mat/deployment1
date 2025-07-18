import React from 'react';

const featured = [
  { id: 101, title: 'Logo Design', provider: 'Alice', imageUrl: '/images/logo-design.jpg' },
  { id: 102, title: 'Yoga Classes', provider: 'Bob', imageUrl: '/images/yoga.jpg' },
  { id: 103, title: 'PC Repair', provider: 'Charlie', imageUrl: '/images/pc-repair.jpg' },
];

export default function FeaturedServices() {
  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-4">Featured Services</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {featured.map((item) => (
          <div key={item.id} className="min-w-[200px] bg-white rounded shadow p-4 flex-shrink-0">
            <img src={item.imageUrl} alt={item.title} className="w-full h-24 object-cover rounded" />
            <div className="mt-2 font-bold">{item.title}</div>
            <div className="text-xs text-gray-500">By {item.provider}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 