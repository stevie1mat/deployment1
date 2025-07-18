'use client';

import Image from 'next/image';

export default function ServicesBanner() {
    return (
        <section className="relative bg-[#FEEFF8] rounded-2xl mt-12 mx-auto max-w-7xl pl-30 px-6 py-6 overflow-hidden flex flex-col md:flex-row items-center justify-between">
            {/* Left Text */}
            <div className="relative z-10 text-left md:max-w-lg">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    All Services
                </h2>
                <p className="text-gray-700 text-base mb-6">
                    Browse time-based services offered by your trusted community.
                </p>

                <button className="flex items-center gap-2 text-sm font-medium text-gray-800">
                    <span className="bg-white rounded-full p-2 shadow">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 4l8 6-8 6V4z" />
                        </svg>
                    </span>
                    How TradeMinutes Works
                </button>
            </div>

            {/* Right Illustration */}
            <div className="hidden md:block relative z-10 pr-20">
                <Image
                    src="/services-banner.png"
                    alt="Illustration"
                    width={320}
                    height={180}
                    className="object-contain"
                />
            </div>

            {/* Shapes inside banner */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#FADCE5] rounded-br-full z-0"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#F9B7C3] rounded-tl-full z-0"></div>
        </section>
    );
}
