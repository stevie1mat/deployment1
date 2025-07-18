import React from 'react';

type Service = {
  id: number;
  title: string;
  description: string;
  provider: string;
  price: number;
  rating: number;
  imageUrl: string;
};

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="rounded shadow p-4 bg-white flex flex-col">
      <img src={service.imageUrl} alt={service.title} className="w-full h-40 object-cover rounded" />
      <h3 className="font-bold mt-2 text-lg">{service.title}</h3>
      <p className="text-sm text-gray-600 flex-1">{service.description}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-green-600 font-semibold">${service.price}</span>
        <span className="text-yellow-500">★ {service.rating}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">By {service.provider}</span>
        <button className="bg-blue-500 text-white px-3 py-1 rounded">View</button>
      </div>
    </div>
  );
} 