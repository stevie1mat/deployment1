'use client';

export default function ContactForm() {
  return (
    <div className="bg-white rounded-xl shadow-md pt-10 pb-10 p-8 w-full max-w-xl mx-auto md:mx-0">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Tell us about yourself</h3>
      <p className="text-sm text-gray-500 mb-6">
        Whether you have questions or you would just like to say hello, contact us.
      </p>

      <form className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <textarea
          placeholder="Description"
          rows={5}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-green-600 transition"
        >
          Send Messages →
        </button>
      </form>
    </div>
  );
}
