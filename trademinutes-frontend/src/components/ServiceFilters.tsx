import React from 'react';

export default function ServiceFilters() {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-8">
      <input
        type="text"
        placeholder="Search services..."
        className="px-4 py-2 border rounded w-full max-w-xs"
      />
      <select className="px-4 py-2 border rounded">
        <option>All Categories</option>
        <option>Tutoring</option>
        <option>Home Repair</option>
        <option>Design</option>
        <option>Gardening</option>
        <option>Tech Support</option>
        <option>Fitness</option>
      </select>
      <select className="px-4 py-2 border rounded">
        <option>Any Price</option>
        <option>Under $20</option>
        <option>$20 - $50</option>
        <option>Over $50</option>
      </select>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Filter</button>
    </div>
  );
}
