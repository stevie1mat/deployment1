'use client';

export default function BecomeSellerSection() {
  return (
    <section className="bg-emerald-50 py-16 px-6 rounded-3xl max-w-7xl mx-auto mt-20">
      <div className="grid md:grid-cols-2 gap-10 items-center pl-10">
        {/* Left Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Become a Seller
          </h2>
          <p className="text-gray-700 text-base mb-6">
            Share your skills and earn time credits. From tutoring and tech help to pet care and cooking —
            TradeMinutes is where your services are truly valued by your local community.
          </p>

          <ul className="text-sm text-gray-700 space-y-3 mb-6">
            <li>List any skill or service you want to offer</li>
            <li>Earn time credits for every task completed</li>
            <li>Exchange credits for help from others</li>
            <li>Build your reputation through community reviews</li>
          </ul>

          <button className="bg-emerald-600 text-white px-6 py-3 rounded-md font-medium hover:bg-emerald-700 transition">
            Start Selling ↗
          </button>
        </div>

        {/* Right Visual (optional placeholder) */}
        <div className="hidden md:flex justify-center">
          <img
            src="/seller-banner.png"
            alt="Become a Seller Illustration"
            className="max-w-sm rounded-xl"
          />
        </div>
      </div>
    </section>
  );
}
