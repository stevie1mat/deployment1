'use client';

import { FiCheck, FiArrowUpRight } from 'react-icons/fi';
import Image from 'next/image';

export default function FindHelpSection() {
  return (
    <section className="bg-emerald-900 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Images */}
        <div className="relative flex justify-center items-center">
          {/* Background people images */}
          <div className="relative">
            <Image
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Community helper"
              width={250}
              height={300}
              className="rounded-lg object-cover"
            />

            <div className="absolute -top-4 -left-6 bg-white text-black p-4 rounded-lg shadow-md text-sm">
              <p className="font-semibold">4.9/5</p>
              <p className="text-xs text-gray-600">Rated by neighbors</p>
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white p-2  rounded-lg flex items-center gap-1 shadow-md">
             
            
              <span className="text-sm font-medium text-black ml-2">15k+ Members Helped</span>
            </div>
          </div>

          {/* Second person */}
          <div className="ml-6 hidden md:block relative">
            <Image
              src="https://images.pexels.com/photos/718978/pexels-photo-718978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Community woman"
              width={250}
              height={300}
              className="rounded-lg object-cover"
            />

            <div className="absolute top-6 right-[-16px] bg-white text-black p-4 rounded-lg shadow-md text-sm">
              <p className="font-semibold">+30,000</p>
              <p className="text-xs text-gray-600">Tasks Completed</p>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Join a Community Where Help Is the Currency
          </h2>
          <p className="text-gray-200 mb-6">
            TradeMinutes lets you exchange time and skills without money. Help someone with what you know, and earn time credits to use when you need help.
          </p>

          <ul className="space-y-4 text-gray-100 mb-8">
            <li className="flex items-start gap-2">
              <FiCheck className="mt-1 text-green-400" />
              Offer or request help from trusted, reviewed community members
            </li>
            <li className="flex items-start gap-2">
              <FiCheck className="mt-1 text-green-400" />
              Track your time credits and balance effortlessly
            </li>
            <li className="flex items-start gap-2">
              <FiCheck className="mt-1 text-green-400" />
              Help one another, build trust, and grow your local network
            </li>
          </ul>

          <button className="bg-green-500 text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-green-600">
            Find Help <FiArrowUpRight />
          </button>
        </div>
      </div>
    </section>
  );
}
