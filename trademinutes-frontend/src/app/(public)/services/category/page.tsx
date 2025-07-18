'use client';

import CategoryBanner from '@/components/CategoryBanner';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryTabsWithBreadcrumb from '@/components/CategoriesWithBreadcrumbs';
import CategoriesGrid from '@/components/CategoriesGrid';
import TradeMinutesActionSteps from '@/components/ActionSteps';

export default function CategoryPage() {
  return (
    <main className="bg-white min-h-screen text-black">
      <Navbar />
      <br/>
      <CategoryTabsWithBreadcrumb />
      <CategoryBanner />
    <CategoriesGrid />
 <TradeMinutesActionSteps />
      <Footer />
    </main>
  );
}
