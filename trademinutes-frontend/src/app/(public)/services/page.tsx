"use client";

import ServiceFilters from '@/components/ServiceFilters';
import CategoriesGrid from '@/components/CategoriesGrid';
import FeaturedServices from '@/components/FeaturedServices';
import ServiceCard from '@/components/ServiceCard';
import ServicesMap from '@/components/ServicesMap';
import { useState, useEffect } from 'react';

// Placeholder data for now
const mockServices = [
  { id: 1, title: 'Math Tutoring', description: 'Expert help for high school and college math.', provider: 'Jane Doe', price: 20, rating: 4.8, imageUrl: '/images/math-tutoring.jpg' },
  { id: 2, title: 'Gardening Help', description: 'Professional gardening and landscaping.', provider: 'John Smith', price: 35, rating: 4.6, imageUrl: '/images/gardening.jpg' },
  // ...more
];

export default function ExploreServicesPage() {
  // In real use, fetch services, categories, featured, etc.
  const [services, setServices] = useState(mockServices);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Services</h1>
      <ServiceFilters />
      <CategoriesGrid />
      <FeaturedServices />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8">
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      <ServicesMap services={services} />
    </main>
  );
} 