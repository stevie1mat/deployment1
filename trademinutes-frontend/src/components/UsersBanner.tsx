'use client';

import Image from 'next/image';

export default function ServicesBanner() {
    return (
        <section className="relative bg-orange-100 rounded-2xl mt-12 mx-auto max-w-7xl pl-30 px-6 py-6 overflow-hidden flex flex-col md:flex-row items-center justify-between">
            {/* Left Text */}
            <div className="relative z-10 text-left md:max-w-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Top Users
                </h2>
                <p className="text-gray-700 text-base mb-6">
                    Explore top-trusted users offering time-based services near you.
                </p>

              
            </div>

            {/* Right Illustration */}
            <div className="hidden md:block relative z-10 pr-20">
                <Image
                    src="/topuser-banner.png"
                    alt="Illustration"
                    width={420}
                    height={220}
                    className="object-contain"
                />
            </div>

            {/* Shapes inside banner */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-orange-200 rounded-br-full z-0"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-300 rounded-tl-full z-0"></div>
        </section>
    );
}
