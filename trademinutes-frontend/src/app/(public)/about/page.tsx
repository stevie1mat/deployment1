import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';
import TradeMinutesPlans from '@/components/MembershipPlans';
import Navbar from '@/components/Navbar';
import TalentCallout from '@/components/TalentCallout';
import Testimonials from '@/components/Testimonials';
import TradeMinutesHero from '@/components/TradeMinutesHero';
import TrustedFreelancersSection from '@/components/TrustedUsersSection';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero section */}
      <Navbar/>
      <TradeMinutesHero />

      {/* Additional About content */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-4">Why TradeMinutes?</h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          TradeMinutes was built on a simple belief: time is valuable — and everyone has a skill
          worth sharing. Whether you're tutoring, dog walking, repairing a bike, or teaching yoga,
          you can trade your time for credits and use them to get the help you need in return.
        </p>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          We’re creating a trust-based, cash-free local economy — where contributions are
          community-powered and everyone gains. By using time credits instead of money, TradeMinutes
          enables fair access to everyday services without financial barriers.
        </p>

        {/* Optional: Team, stats, or values */}
        <div className="mt-10 grid gap-6 md:grid-cols-3 text-sm">
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="font-semibold mb-2 text-emerald-700">3,200+ Hours Exchanged</h3>
            <p className="text-gray-500">Every hour offered earns time credits you can redeem for services.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="font-semibold mb-2 text-emerald-700">Trusted by 900+ Members</h3>
            <p className="text-gray-500">Real users offering real help within their neighborhoods.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="font-semibold mb-2 text-emerald-700">Built for Local Impact</h3>
            <p className="text-gray-500">Our mission is to enable more giving and less spending.</p>
          </div>
        </div>
      </section>
      <TrustedFreelancersSection/>
      <TradeMinutesPlans />
      <Testimonials />
      <TalentCallout />
      <Footer/>
    </main>
  );
}
