'use client';

import Image from 'next/image';

const blogPosts = [
  {
    date: 'June 10, 2025',
    title: 'How to Earn Time Credits Helping Neighbors',
    excerpt: 'Learn how everyday tasks can be turned into valuable time credits using TradeMinutes.',
    image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    date: 'June 5, 2025',
    title: '10 Ways to Spend Your Time Credits This Summer',
    excerpt: 'Discover creative and impactful ways to use your earned time credits within the community.',
    image: 'https://images.pexels.com/photos/303040/pexels-photo-303040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    date: 'June 1, 2025',
    title: 'Why Time Is a Better Currency Than Cash',
    excerpt: 'Explore the philosophy behind time banking and how it’s changing lives.',
    image: 'https://images.pexels.com/photos/110471/pexels-photo-110471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    date: 'May 28, 2025',
    title: 'Building Trust in Local Communities with TradeMinutes',
    excerpt: 'Tips to get started with safe, meaningful exchanges in your area.',
    image: 'https://images.pexels.com/photos/19418844/pexels-photo-19418844/free-photo-of-open-sign-of-a-store.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

export default function BlogSection() {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">From the TradeMinutes Blog</h2>
        <p className="text-gray-500 mt-2">Inspiration, tips, and real-life stories from our community</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {blogPosts.map((post, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              width={400}
              height={300}
              className="object-cover w-full h-48"
            />
            <div className="p-4">
              <p className="text-sm text-gray-400 mb-1">{post.date}</p>
              <h3 className="text-md font-semibold mb-1">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
