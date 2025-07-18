'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const services = [
  
   {
    id: 1,
    category: 'Home Repair',
    title: 'I will help organize your closet for spring',
    rating: 4.88,
    reviews: 24,
    user: 'Sarah Kim',
    avatar: 'https://images.pexels.com/photos/277576/pexels-photo-277576.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 60,
    image: 'https://cdn.pixabay.com/photo/2016/11/19/13/06/bed-1839184_1280.jpg',
  },
  {
    id: 2,
    category: 'Language Exchange',
    title: 'I will tutor Grade-9 science for 1 hour',
    rating: 4.93,
    reviews: 26,
    user: 'Daniel Ortiz',
    avatar: 'https://images.pexels.com/photos/792096/pexels-photo-792096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 59,
    image: 'https://cdn.pixabay.com/photo/2021/11/06/00/38/volunteer-service-6772198_1280.jpg',
  },
  {
    id: 3,
    category: 'Home Repair',
    title: 'I will walk your dog every evening',
    rating: 4.96,
    reviews: 48,
    user: 'Ayesha Patel',
    avatar: 'https://images.pexels.com/photos/721979/pexels-photo-721979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 114,
    image: 'https://cdn.pixabay.com/photo/2015/11/17/13/13/puppy-1047521_1280.jpg',
  },
  {
    id: 4,
    category: 'Fitness & Wellness',
    title: 'I will troubleshoot and clean your PC',
    rating: 4.85,
    reviews: 58,
    user: 'Michael Chen',
    avatar: 'https://images.pexels.com/photos/573570/pexels-photo-573570.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 76,
    image: 'https://cdn.pixabay.com/photo/2020/10/21/18/07/laptop-5673901_1280.jpg',
  },
  {
    id: 5,
    category: 'Fitness & Wellness',
    title: 'I will design a simple logo for your business',
    rating: 4.94,
    reviews: 30,
    user: 'Liam Johnson',
    avatar: 'https://images.pexels.com/photos/794551/pexels-photo-794551.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 42,
    image: 'https://cdn.pixabay.com/photo/2016/11/19/13/53/apple-1839363_1280.jpg',
  },
  {
    id: 6,
    category: 'Home Repair',
    title: 'I will lead a 30-min yoga session',
    rating: 4.91,
    reviews: 47,
    user: 'Olivia Brown',
    avatar: 'https://images.pexels.com/photos/735423/pexels-photo-735423.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 95,
    image: 'https://cdn.pixabay.com/photo/2016/01/18/09/48/yoga-1146281_1280.jpg',
  },
  {
    id: 7,
    category: 'Language Exchange',
    title: 'I will help you practice French conversation',
    rating: 4.95,
    reviews: 25,
    user: 'Noah Wilson',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 84,
    image: 'https://images.pexels.com/photos/845457/pexels-photo-845457.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 8,
    category: 'Household Help',
    title: 'I will assemble flat-pack furniture',
    rating: 4.92,
    reviews: 29,
    user: 'Emma Davis',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 70,
    image: 'https://cdn.pixabay.com/photo/2021/12/23/03/58/da-guojing-6888603_1280.jpg',
  },
  {
    id: 9,
    category: 'Household Help',
    title: 'I will prep 3 days of vegetarian lunches',
    rating: 4.89,
    reviews: 18,
    user: 'Ethan Miller',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 65,
    image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 10,
    category: 'Tutoring & Study',
    title: 'I will help your child with reading skills',
    rating: 4.93,
    reviews: 34,
    user: 'Ava Martinez',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 90,
    image: 'https://images.pexels.com/photos/267582/pexels-photo-267582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 11,
    category: 'Pet Care',
    title: 'I will pet sit your cat for a weekend',
    rating: 4.96,
    reviews: 38,
    user: 'Mason Garcia',
    avatar: 'https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg',
    price: 80,
    image: 'https://cdn.pixabay.com/photo/2018/01/03/19/17/cat-3059075_1280.jpg',
  },
  {
    id: 12,
    category: 'Tech Help',
    title: 'I will set up your smart TV and apps',
    rating: 4.87,
    reviews: 22,
    user: 'Sophia Robinson',
    avatar: 'https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg',
    price: 100,
    image: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 13,
    category: 'Creative Skills',
    title: 'I will create custom artwork for your room',
    rating: 4.95,
    reviews: 40,
    user: 'Logan Clark',
    avatar: 'https://cdn.pixabay.com/photo/2016/06/20/04/30/asian-man-1468032_1280.jpg',
    price: 115,
    image: 'https://cdn.pixabay.com/photo/2017/06/15/17/22/sculpture-2406078_1280.jpg',
  },
  {
    id: 14,
    category: 'Fitness & Wellness',
    title: 'I will do a virtual guided meditation',
    rating: 4.88,
    reviews: 27,
    user: 'Isabella Lee',
    avatar: 'https://cdn.pixabay.com/photo/2016/06/20/04/30/asian-man-1468032_1280.jpg',
    price: 60,
    image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 15,
    category: 'Language Exchange',
    title: 'I will translate a short Spanish paragraph',
    rating: 4.91,
    reviews: 35,
    user: 'Lucas Hall',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 45,
    image: 'https://images.pexels.com/photos/5428831/pexels-photo-5428831.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 16,
    category: 'Home Repair',
    title: 'I will repair a leaking kitchen faucet',
    rating: 4.89,
    reviews: 31,
    user: 'Mia Allen',
    avatar: 'https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg',
    price: 125,
    image: 'https://images.pexels.com/photos/3693096/pexels-photo-3693096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 17,
    category: 'Household Help',
    title: 'I will cook a family-style Indian dinner',
    rating: 4.93,
    reviews: 39,
    user: 'Elijah Young',
    avatar: 'https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg',
    price: 98,
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 18,
    category: 'Tutoring & Study',
    title: 'I will help with exam prep for chemistry',
    rating: 4.95,
    reviews: 50,
    user: 'Charlotte King',
    avatar: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 110,
    image: 'https://images.pexels.com/photos/4145190/pexels-photo-4145190.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 19,
    category: 'Pet Care',
    title: 'I will feed and play with your pet while you\'re away',
    rating: 4.97,
    reviews: 42,
    user: 'James Wright',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 72,
    image: 'https://images.pexels.com/photos/4587991/pexels-photo-4587991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    id: 20,
    category: 'Tech Help',
    title: 'I will help fix basic Wi-Fi connection issues',
    rating: 4.9,
    reviews: 21,
    user: 'Amelia Scott',
    avatar: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 55,
    image: 'https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  }
];

const PER_PAGE = 8;

export default function ServiceGrid({ items = services }: { items?: (typeof services[0] & { _id?: string | number, ID?: string | number })[] }) {
  console.log("ServiceGrid items:", items);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / PER_PAGE);
  const router = useRouter();

  // slice out only the items for the current page
  const paginated = items.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const goTo = (p: number) => setPage(Math.min(Math.max(p, 1), totalPages));

  const handleCardClick = (serviceId: string | number) => {
    router.push(`/tasks/view/${String(serviceId)}`);
  };

  return (
    <>
      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-15">
        {paginated.map((s, idx) => {
          // Colorful border palette matching the listing page
          const borderColors = [
            'border-green-400',
            'border-blue-400',
            'border-pink-400',
            'border-yellow-400',
            'border-purple-400',
            'border-orange-400',
          ];
          const borderClass = borderColors[idx % borderColors.length];
          
          return (
            <div
              key={`${s.id}-${idx}`}
              className={`bg-white rounded-lg p-5 shadow-md hover:shadow-xl relative border-2 ${borderClass} cursor-pointer transition-all duration-200 hover:scale-105`}
              onClick={() => handleCardClick(s._id || s.id)}
            >
              <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
              <p className="text-xs text-gray-500 mb-1">
                📂 <strong>{s.category}</strong>
              </p>
              
              {/* rating */}
              <div className="flex items-center text-xs text-gray-500 mb-1">
                <FiStar className="text-yellow-400 mr-1" />
                {s.rating} ({s.reviews} reviews)
              </div>

              {/* user info */}
              <div className="flex items-center gap-2 mb-2">
                <Image
                  src={s.avatar}
                  alt={s.user}
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />
                <span className="text-xs text-gray-500">
                  👤 <strong>{s.user}</strong>
                </span>
              </div>

              {/* price */}
              <p className="text-sm font-medium text-gray-700">
                🪙 {s.price} credits
              </p>
            </div>
          );
        })}
      </div>

      {/* pagination controls */}
      {totalPages > 1 && (
  <div className="flex items-center justify-center gap-2 mt-18 mb-18">
    <button
      onClick={() => goTo(page - 1)}
      disabled={page === 1}
      className="px-3 py-1 rounded border border-black text-black disabled:opacity-40"
    >
      Prev
    </button>

    {Array.from({ length: totalPages }).map((_, i) => (
      <button
        key={`page-btn-${i + 1}`}
        onClick={() => goTo(i + 1)}
        className={`px-3 py-1 rounded border border-black ${
          page === i + 1
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-black'
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      onClick={() => goTo(page + 1)}
      disabled={page === totalPages}
      className="px-3 py-1 rounded border border-black text-black disabled:opacity-40"
    >
      Next
    </button>
  </div>
)}

    </>
  );
}

export { services };