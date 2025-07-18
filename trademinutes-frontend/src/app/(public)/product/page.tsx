'use client';

import CategoryBanner from '@/components/CategoryBanner';
import ServiceFilters from '@/components/ServiceFilters';
import ServiceGrid from '@/components/ServiceGrid';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryTabsWithBreadcrumb from '@/components/CategoriesWithBreadcrumbs';

export default function ProductPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <br/>
      <CategoryTabsWithBreadcrumb />
      <CategoryBanner />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <ServiceFilters />
          <span className="text-sm text-gray-500">Sort by <strong>Best Seller</strong></span>
        </div>
        <ServiceGrid />
      </div>
      <Footer />
    </main>
  );
}
