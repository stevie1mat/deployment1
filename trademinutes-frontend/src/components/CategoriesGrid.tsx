import React from 'react';

const categories = [
  { name: 'Tutoring', icon: '📚' },
  { name: 'Home Repair', icon: '🔧' },
  { name: 'Design', icon: '🎨' },
  { name: 'Gardening', icon: '🌱' },
  { name: 'Tech Support', icon: '💻' },
  { name: 'Fitness', icon: '🏋️' },
];

export default function CategoriesGrid() {
  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold mb-4 text-center">Categories</h2>
      <div className="w-full flex justify-center">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button key={cat.name} className="flex flex-col items-center p-4 bg-gray-100 rounded hover:bg-blue-100 transition">
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
