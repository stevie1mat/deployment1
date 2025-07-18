'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const plans = [
  {
    name: 'Basic',
    price: 29,
    yearlyPrice: 232, // 20 % off
    features: [
      '1 Listing',
      '30-Day Visibility',
      'Search Highlight',
      '4 Revisions',
      '9-Day Delivery',
      'Product Support',
    ],
  },
  {
    name: 'Standard',
    price: 49,
    yearlyPrice: 392,
    features: [
      '1 Listing',
      '30-Day Visibility',
      'Search Highlight',
      '4 Revisions',
      '9-Day Delivery',
      'Product Support',
    ],
    featured: true, // ⬅ “Most Popular”
  },
  {
    name: 'Extended',
    price: 89,
    yearlyPrice: 712,
    features: [
      '1 Listing',
      '30-Day Visibility',
      'Search Highlight',
      '4 Revisions',
      '9-Day Delivery',
      'Product Support',
    ],
  },
  {
    name: 'Enterprise',
    price: 129,
    yearlyPrice: 1032,
    features: [
      '1 Listing',
      '30-Day Visibility',
      'Search Highlight',
      '4 Revisions',
      '9-Day Delivery',
      'Product Support',
    ],
  },
];

export default function TradeMinutesPlans() {
  const [yearly, setYearly] = useState(false);
  const toggle = () => setYearly(!yearly);

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Membership Plans</h2>
        <p className="text-gray-500 text-sm mt-2">
          Trade your skills on your terms — pick a plan that fits.
        </p>

        {/* Billing toggle */}
        <div className="flex justify-center items-center gap-3 mt-6 text-sm">
          <span className={!yearly ? 'font-medium text-gray-900' : 'text-gray-400'}>
            Billed&nbsp;Monthly
          </span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input type="checkbox" checked={yearly} onChange={toggle} className="sr-only" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-600 transition-colors" />
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                yearly ? 'translate-x-5' : ''
              }`}
            />
          </label>
          <span className={yearly ? 'font-medium text-gray-900' : 'text-gray-400'}>
            Billed&nbsp;Yearly <span className="text-emerald-600">Save&nbsp;20%</span>
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col items-center rounded-xl border border-gray-200 p-6 text-center shadow-sm ${
              plan.featured ? 'bg-white shadow-lg scale-105' : 'bg-white'
            }`}
          >
            {/* Most-popular badge */}
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs px-3 py-0.5 rounded-full shadow">
                Most&nbsp;Popular
              </span>
            )}

            {/* Price with animation */}
            <div className="mb-1 flex items-baseline justify-center h-10">
              <span className="text-2xl font-bold">$</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={yearly ? 'yearly' + plan.name : 'monthly' + plan.name}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-4xl font-bold"
                >
                  {yearly ? plan.yearlyPrice : plan.price}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-sm text-gray-500 mb-4">
              / {yearly ? 'yearly' : 'monthly'}
            </span>

            <p className="font-semibold mb-2">{plan.name} Plan</p>
            <p className="text-sm text-gray-500 mb-4">
              One-time fee for each listing or task highlighted in search.
            </p>

            <ul className="text-sm text-gray-700 mb-6 space-y-2">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <button className="w-full bg-emerald-100 text-emerald-800 py-2 rounded-md text-sm font-medium hover:bg-emerald-200 transition-colors">
              Buy Now ↗
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
