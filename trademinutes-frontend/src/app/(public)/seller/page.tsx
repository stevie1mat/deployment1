'use client';

import Navbar from '@/components/Navbar';
import ContactHeader from '@/components/ContactHeader';
import ContactForm from '@/components/ContactForm'; // 👈 Create/import this
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import FAQ from '@/components/FAQ';
import SellerBanner from '@/components/SellerBanner';
import HiringFreelancingTabs from '@/components/HiringFreelancingTabs';
import HowItWorksSection from '@/components/HowItWorksSection';
import FindHelpSection from '@/components/FindHelpSection';
import OurTeamSection from '@/components/OurTeamSection';

export default function SellerPage() {
    return (
        <div className="text-black bg-white min-h-screen w-full">
            <Navbar />

            <main className="bg-white min-h-screen">
                <div className='space-y-10'>
                    <SellerBanner />
                </div>
                <HiringFreelancingTabs />
                 <FindHelpSection />
                <HowItWorksSection/>
                <OurTeamSection/>
                {/* Contact Section */}
                <section className="max-w-7xl mx-auto mt-10 mb-10 grid md:grid-cols-2 gap-12 px-6 py-16 items-start">
                    {/* Left: Contact Details */}
                    <div className="space-y-8">
                        <h3 className="text-xl font-semibold text-gray-800">Keep In Touch With Us.</h3>
                        <p className="text-sm text-gray-600">
                            Feel free to reach out to us with any questions or suggestions. We're always happy to hear from you!
                        </p>

                        <div className="flex items-start gap-4">
                            <div className="bg-[#FAF6ED] p-2 rounded-full">
                                <MapPinIcon className="w-5 h-5 text-green-800" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">Address</h4>
                                <p className="text-sm text-gray-600">
                                    328 Queensberry Street, North<br />
                                    Melbourne VIC 3051, Australia
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-[#FAF6ED] p-2 rounded-full">
                                <PhoneIcon className="w-5 h-5 text-green-800" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">Phone</h4>
                                <p className="text-sm text-gray-600">+(0) 392 94 03 01</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-[#FAF6ED] p-2 rounded-full">
                                <EnvelopeIcon className="w-5 h-5 text-green-800" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-800">Email</h4>
                                <p className="text-sm text-gray-600">hello@trademinutes.com</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <ContactForm />

                </section>
                {/* Map Section */}
              
                <FAQ />
            </main>
        </div>
    );
}
