'use client';

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-gray-300 pt-10">
      <div className="border-b border-gray-700 px-6 pb-6 flex flex-wrap justify-between items-center max-w-7xl mx-auto">
        <div className="space-x-6 text-sm">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Site Map</a>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <span>Follow us</span>
          <a href="#" className="hover:text-white"><FaFacebookF /></a>
          <a href="#" className="hover:text-white"><FaTwitter /></a>
          <a href="#" className="hover:text-white"><FaInstagram /></a>
          <a href="#" className="hover:text-white"><FaLinkedinIn /></a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 px-6 py-10 max-w-7xl mx-auto">
        {/* About */}
        <div>
          <h4 className="text-white font-semibold mb-4">About</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#">Our Mission</a></li>
            <li><a href="#">Community Stories</a></li>
            <li><a href="#">Partnerships</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-semibold mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#">Household Help</a></li>
            <li><a href="#">Tutoring</a></li>
            <li><a href="#">Elderly Care</a></li>
            <li><a href="#">Pet Services</a></li>
            <li><a href="#">Tech Support</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Trust & Safety</a></li>
            <li><a href="#">Become a Helper</a></li>
            <li><a href="#">Using Time Credits</a></li>
          </ul>
        </div>

        {/* Subscribe */}
        <div className="col-span-2">
          <h4 className="text-white font-semibold mb-4">Subscribe</h4>
          <div className="flex items-center bg-zinc-800 rounded overflow-hidden max-w-md">
            <input
              type="email"
              placeholder="Your email address"
              className="bg-transparent p-3 w-full outline-none text-white"
            />
            <button className="bg-emerald-600 px-4 py-2 text-white font-medium hover:bg-emerald-700">
              Send
            </button>
          </div>

          <div className="mt-6">
            <h4 className="text-white font-semibold mb-2">Apps</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#">📱 iOS App</a></li>
              <li><a href="#">📱 Android App</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center text-sm border-t border-gray-700 py-4 text-gray-500">
        © TradeMinutes 2025. All rights reserved.
      </div>
    </footer>
  );
}
