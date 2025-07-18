// components/Pricing.tsx

export default function Pricing() {
  return (
    <section className="py-16 px-6">
      <h2 className="text-3xl text-center mb-8 font-bold">Pricing Plans</h2>
      <div className="flex justify-center gap-12">
        <div className="max-w-xs p-6 border rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Free Plan</h3>
          <p className="text-lg mb-4">Basic access to browse and exchange services.</p>
          <ul className="list-disc ml-4 mb-6">
            <li>Browse offers and requests</li>
            <li>Earn time credits</li>
          </ul>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full w-full hover:bg-blue-700">
            Get Started
          </button>
        </div>

        <div className="max-w-xs p-6 border rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Premium Plan</h3>
          <p className="text-lg mb-4">Advanced features, priority support, and extra credits.</p>
          <ul className="list-disc ml-4 mb-6">
            <li>Priority support</li>
            <li>Bonus time credits</li>
            <li>Exclusive tasks</li>
          </ul>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full w-full hover:bg-blue-700">
            Sign Up
          </button>
        </div>
      </div>
    </section>
  );
}
