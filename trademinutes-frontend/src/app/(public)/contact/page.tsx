'use client';

import Navbar from '@/components/Navbar';
import ContactHeader from '@/components/ContactHeader';
import ContactForm from '@/components/ContactForm'; // 👈 Create/import this
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import FAQ from '@/components/FAQ';

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen w-full">
            <Navbar />

            <main className="bg-white min-h-screen">
                <div className='space-y-10'>
                    <ContactHeader />
                </div>

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
                <section className="max-w-7xl mx-auto px-6 pb-16">
                    <div className="rounded-xl overflow-hidden shadow-md">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19809.964658113536!2d-0.14451707908863287!3d51.50329717327068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487604b054f61e15%3A0xd04c4a32a8c46b7f!2sLondon%20Eye!5e0!3m2!1sen!2sus!4v1718358050535!5m2!1sen!2sus"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </section>
                <FAQ />
            </main>
        </div>
    );
}
