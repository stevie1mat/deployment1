'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
  FiStar,
} from 'react-icons/fi';

const services = [
  {
    id: 1,
    category: 'Household Help',
    title: 'I will prep three healthy family dinners this week',
    rating: 4.93,
    reviews: 28,
    user: 'Sarah Kim',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',          // put an image in /public/avatars
    price: 30,                              // hours (time credits)
    image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',        // your own image path or URL
  },
  {
    id: 2,
    category: 'Tutoring & Study',
    title: 'I will tutor Grade-10 math for your child (1-hour session)',
    rating: 4.88,
    reviews: 41,
    user: 'Daniel Ortiz',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 100,
    image: 'https://images.pexels.com/photos/267582/pexels-photo-267582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 3,
    category: 'Pet Care',
    title: 'I will walk your dog every weekday morning',
    rating: 4.95,
    reviews: 19,
    user: 'Ayesha Patel',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 75,                              // five 30-min walks → 5 credits
    image: 'https://images.pexels.com/photos/1322182/pexels-photo-1322182.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
   {
    id: 5,
    category: 'Fitness & Wellness',
    title: 'I will lead a beginner yoga session for up to 4 people',
    rating: 4.97,
    reviews: 22,
    user: 'Laura Singh',
    avatar: 'https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 52,
    image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 4,
    category: 'Tech Help',
    title: 'I will set up your new laptop and transfer files',
    rating: 4.90,
    reviews: 33,
    user: 'Michael Chen',
    avatar: 'https://images.pexels.com/photos/8159846/pexels-photo-8159846.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 120,
    image: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
 
];


export default function TrendingServices() {
  const rowRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: 'left' | 'right') => {
    const container = rowRef.current;
    if (!container) return;
    const shift = dir === 'left' ? -320 : 320; // pixel step
    container.scrollBy({ left: shift, behavior: 'smooth' });
  };

  return (
    <section className="bg-[#f3fbfa] py-30 px-4">
      <div className="max-w-7xl mx-auto">
        {/* heading */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold">Trending Services</h2>
            <p className="text-gray-500 mt-1">
              Most viewed and all-time top-selling services
            </p>
          </div>
          <button className="text-sm font-semibold text-gray-700 hover:text-black flex items-center">
            All Categories <span className="ml-1">→</span>
          </button>
        </div>

        {/* cards row */}
        <div className="relative">
          {/* horizontal list */}
          <div
            ref={rowRef}
            className="overflow-x-auto scroll-smooth whitespace-nowrap snap-x snap-mandatory no-scrollbar px-[2px]"
          >
            <div className="inline-flex gap-6">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-lg shadow-sm min-w-[300px] max-w-[300px] snap-start flex-shrink-0"
                >
                  {/* image */}
                  <div className="relative">
                    <Image
                      src={s.image}
                      alt={s.title}
                      width={300}
                      height={200}
                      className="rounded-t-lg object-cover h-[200px] w-full"
                    />
                    <button className="absolute top-2 right-2 bg-white rounded-full p-2 shadow">
                      <FiHeart />
                    </button>
                  </div>

                  {/* content */}
                  <div className="p-4">
                    <p className="text-sm text-gray-500">{s.category}</p>
                    <h3 className="text-[17px] font-semibold mt-1 text-gray-900 truncate">
  {s.title}
</h3>


                    {/* rating */}
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <FiStar className="text-yellow-400 mr-1" />
                      {s.rating}
                      <span className="ml-1">({s.reviews} reviews)</span>
                    </div>

                    {/* footer */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Image
                          src={s.avatar}
                          alt={s.user}
                          width={28}
                          height={28}
                          objectFit='cover'
                          className="rounded-full"
                        />
                        <span className="text-sm">{s.user}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Starting at{' '}
                        <strong className="text-black">${s.price}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* arrows */}
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute -left-5 top-[40%] bg-white rounded-full shadow p-2"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute -right-5 top-[40%] bg-white rounded-full shadow p-2"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* local CSS */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
