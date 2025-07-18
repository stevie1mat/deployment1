'use client';

import Image from 'next/image';
import { useState } from 'react';

const users = [
  {
    id: 1,
    name: 'Sarah Kim',
    role: 'Healthy Meal Prep Coach',
    rating: 4.9,
    reviews: 198,
    skills: ['Nutrition', 'Meal Plans', 'Vegan Cooking'],
    location: 'Toronto',
    rate: '30 credits / hr',
    success: '97%',
    avatar: 'https://cdn.pixabay.com/photo/2018/10/29/21/46/human-3782189_1280.jpg',
  },
  {
    id: 2,
    name: 'Daniel Ortiz',
    role: 'Math Tutor (Grade 9–12)',
    rating: 4.8,
    reviews: 285,
    skills: ['Algebra', 'Geometry', 'Exam Prep'],
    location: 'Vancouver',
    rate: '45 credits / hr',
    success: '99%',
    avatar: 'https://cdn.pixabay.com/photo/2020/05/01/08/29/portrait-5115894_1280.jpg',
  },
  {
    id: 3,
    name: 'Ayesha Patel',
    role: 'Dog Walker & Pet Care',
    rating: 4.95,
    reviews: 142,
    skills: ['Dog Walking', 'Pet Sitting', 'Pet Grooming'],
    location: 'Ottawa',
    rate: '25 credits / hr',
    success: '98%',
    avatar: 'https://cdn.pixabay.com/photo/2014/07/10/11/17/grimace-388987_1280.jpg',
  },
  {
    id: 4,
    name: 'Michael Chen',
    role: 'Tech Help & Setup',
    rating: 4.9,
    reviews: 176,
    skills: ['PC Setup', 'Wi-Fi Fixes', 'Smart Devices'],
    location: 'Calgary',
    rate: '40 credits / hr',
    success: '96%',
    avatar: 'https://cdn.pixabay.com/photo/2016/09/24/03/20/man-1690965_1280.jpg',
  },
  {
    id: 5,
    name: 'Olivia Brown',
    role: 'Yoga & Wellness Coach',
    rating: 4.87,
    reviews: 134,
    skills: ['Yoga', 'Meditation', 'Stretching'],
    location: 'Montreal',
    rate: '35 credits / hr',
    success: '99%',
    avatar: 'https://cdn.pixabay.com/photo/2018/03/19/22/17/man-3241483_1280.jpg',
  },
  {
    id: 6,
    name: 'David Smith',
    role: 'Bike Repair & Maintenance',
    rating: 4.85,
    reviews: 90,
    skills: ['Brake Fix', 'Chain Repair', 'Tune-ups'],
    location: 'Winnipeg',
    rate: '30 credits / hr',
    success: '95%',
    avatar: 'https://cdn.pixabay.com/photo/2019/03/17/12/57/phone-4060860_1280.jpg',
  },
  {
    id: 7,
    name: 'Sophia Lee',
    role: 'Language Exchange Partner',
    rating: 4.93,
    reviews: 211,
    skills: ['French', 'Spanish', 'Conversation Practice'],
    location: 'Halifax',
    rate: '20 credits / hr',
    success: '98%',
    avatar: 'https://cdn.pixabay.com/photo/2021/08/26/16/58/woman-6576618_1280.jpg',
  },
  {
    id: 8,
    name: 'James Nguyen',
    role: 'Homework Help (Grades 3–6)',
    rating: 4.92,
    reviews: 179,
    skills: ['Reading', 'Math', 'Homework Coaching'],
    location: 'Edmonton',
    rate: '28 credits / hr',
    success: '97%',
    avatar: 'https://cdn.pixabay.com/photo/2018/02/16/14/38/portrait-3157821_1280.jpg',
  },
];

const filterOptions = ['Skills', 'Price', 'Location', 'Level', 'Languages'];

export default function UserGrid() {
  const [filters, setFilters] = useState({
    Skills: '',
    Price: '',
    Location: '',
    Level: '',
    Languages: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="mt-10 px-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-10">
        {filterOptions.map((filter) => (
          <div key={filter} className="relative">
            <button className="px-4 py-2 rounded-md border text-sm text-black bg-white flex items-center gap-1">
              {filter} <span className="text-lg">▾</span>
            </button>
            {/* Optional dropdown content can go here */}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="border rounded-xl bg-white p-5 flex flex-col items-center text-center relative"
          >
            {/* Online Dot */}
            <span className="absolute top-4 right-4 w-3 h-3 rounded-full bg-green-500" />

            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
              <Image
                src={user.avatar}
                alt={user.name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Name & Role */}
            <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{user.role}</p>

            {/* Rating */}
            <p className="text-sm text-yellow-500 font-medium mb-2">
              ⭐ {user.rating}{' '}
              <span className="text-gray-400">({user.reviews} reviews)</span>
            </p>

            {/* Skills */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {user.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs bg-pink-100 text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Location / Rate / Success */}
            <div className="w-full border-t pt-4 flex justify-between text-xs text-gray-600">
              <div>
                <p className="text-gray-400">Location</p>
                <p>{user.location}</p>
              </div>
              <div>
                <p className="text-gray-400">Rate</p>
                <p>{user.rate}</p>
              </div>
              <div>
                <p className="text-gray-400">Job Success</p>
                <p>{user.success}</p>
              </div>
            </div>

            {/* Profile Button */}
            <button className="mt-5 px-4 py-2 text-sm rounded-md bg-green-100 text-green-800 font-medium">
              View Profile ↗
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}