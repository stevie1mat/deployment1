'use client';

import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const faqData = [
  {
    question: 'What methods of payments are supported?',
    answer:
      'We support all major payment methods including credit/debit cards, PayPal, and TradeMinutes credits.',
  },
  {
    question: 'Can I cancel at anytime?',
    answer:
      'Yes, you can cancel your tasks or services anytime before it begins. No charges will apply.',
  },
  {
    question: 'How do I get a receipt for my purchase?',
    answer:
      'You’ll automatically receive a receipt via email after any transaction. You can also download it from your dashboard.',
  },
  {
    question: 'Which license do I need?',
    answer:
      'Most services do not require licensing, but if you are selling digital assets, a standard or extended license may apply.',
  },
  {
    question: 'How do I get access to a task I posted?',
    answer:
      'You can manage your posted tasks directly from your dashboard under the “My Tasks” section.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 bg-white px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
        <p className="text-gray-500 mb-10">
          Learn how TradeMinutes works and how to get the most out of it.
        </p>

        <div className="space-y-4  text-left">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 transition pl-15 pr-15 pt-8 pb-8 ${
                openIndex === index
                  ? 'bg-[#EFFBF8] border-transparent'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggle(index)}
              >
                <h4 className="font-semibold text-gray-900">{item.question}</h4>
                {openIndex === index ? (
                  <FiMinus className="text-gray-600" />
                ) : (
                  <FiPlus className="text-gray-900" />
                )}
              </div>

              {openIndex === index && (
                <p className="mt-4 text-sm text-gray-700">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
