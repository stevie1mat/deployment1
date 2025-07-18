// components/Benefits.tsx

import { FaCheckCircle } from 'react-icons/fa';

export default function Benefits() {
  return (
    <section className="bg-gray-50  py-16 px-46">
      <h2 className="text-3xl text-center mb-20 font-bold">Key Benefits</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
        <div className="flex items-start space-x-4">
          <FaCheckCircle className="text-green-500" size={24} />
          <p>Complete tasks when and where it suits you.</p>
        </div>
        <div className="flex items-start space-x-4">
          <FaCheckCircle className="text-green-500" size={24} />
          <p>Build your skills and help others in your community.</p>
        </div>
        <div className="flex items-start space-x-4">
          <FaCheckCircle className="text-green-500" size={24} />
          <p>Easy-to-use app to track your time credits.</p>
        </div>
      </div>
    </section>
  );
}
