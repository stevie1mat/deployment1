'use client';

import Image from 'next/image';
import { FiStar } from 'react-icons/fi';
import { HiOutlineClipboardList, HiOutlineEye } from 'react-icons/hi';

export default function ProductBanner() {
  return (
    <section className="relative bg-[#FEEFE7] rounded-2xl mt-12 mx-auto max-w-7xl px-6 py-16 overflow-hidden flex flex-col md:flex-row items-center justify-between">
      {/* Left Content */}
      <div className="relative z-10 text-left md:max-w-xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          I will create modern flat design illustration
        </h2>

        {/* Info Row */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700">
          {/* User Info */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Image
                src="/avatar2.jpg"
                alt="Ali Tufan"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <span className="font-medium">Ali Tufan</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <FiStar className="text-yellow-500" />
            <span>4.82</span>
            <span className="text-gray-500">94 reviews</span>
          </div>

          {/* Orders */}
          <div className="flex items-center gap-1">
            <HiOutlineClipboardList />
            <span>2 Order in Queue</span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1">
            <HiOutlineEye />
            <span>902 Views</span>
          </div>
        </div>
      </div>

      {/* Right Illustration */}
      {/* <div className="hidden md:block relative z-10">
        <Image
          src="/categories-banner.png"
          alt="Illustration"
          width={300}
          height={200}
          className="object-contain"
        />
      </div> */}

      {/* Decorative Shapes */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#F5D481] rounded-br-full z-0"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#F5B88C] rounded-tl-full z-0"></div>
    </section>
  );
}
