"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import ServiceCard from '@/components/ServiceCard';
import { useState, useEffect, Suspense } from 'react';

// Mock data for demonstration
const mockServices = [
  { id: 1, title: 'Math Tutoring', description: 'Expert help for high school and college math.', provider: 'Jane Doe', price: 20, rating: 4.8, imageUrl: '/images/math-tutoring.jpg' },
  { id: 2, title: 'Gardening Help', description: 'Professional gardening and landscaping.', provider: 'John Smith', price: 35, rating: 4.6, imageUrl: '/images/gardening.jpg' },
  { id: 3, title: 'Logo Design', description: 'Custom logos for your business.', provider: 'Alice', price: 50, rating: 4.9, imageUrl: '/images/logo-design.jpg' },
];

type Service = typeof mockServices[number];

export default function SearchResultsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchResultsPage />
    </Suspense>
  );
}

function SearchResultsPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Service[]>([]);

  useEffect(() => {
    // In real use, fetch results from API using the query
    if (query) {
      // Simple mock filter
      setResults(mockServices.filter(s => s.title.toLowerCase().includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase())));
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <p className="mb-6 text-gray-600">Showing results for: <span className="font-semibold text-black">{query}</span></p>
      {results.length === 0 ? (
        <div className="text-gray-500">No services found matching your search.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </main>
  );
} 