'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryTabsWithBreadcrumb from '@/components/CategoriesWithBreadcrumbs';
import CategoriesGrid from '@/components/CategoriesGrid';
import TradeMinutesActionSteps from '@/components/ActionSteps';
import UsersBanner from '@/components/UsersBanner';
import UserGrid from '@/components/UserGrid';

export default function UsersTop() {
  return (
    <main className="bg-white min-h-screen text-black">
      <Navbar />
      <br/>
      <CategoryTabsWithBreadcrumb />
      <UsersBanner />
    <div className="max-w-7xl mx-auto px-4 py-8">
            
            <UserGrid />
          </div>
   <TradeMinutesActionSteps />
      <Footer />
    </main>
  );
}
