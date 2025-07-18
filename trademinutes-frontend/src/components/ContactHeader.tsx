'use client';

export default function ContactHeader() {
  return (
    <section className="bg-[#184D3A] rounded-xl mt-15 mx-auto max-w-7xl px-6 py-30 pl-30 relative overflow-hidden">
      <div className="relative z-10 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Contact us</h2>
        <p className="text-gray-200 text-sm md:text-base">
          We'd love to talk about how we can help you.
        </p>
      </div>

      {/* Abstract shape background */}
      <div className="absolute bottom-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-[#F5B88C] rounded-tl-full"></div>
      <div className="absolute top-0 left-0 w-24 h-24 bg-[#F5D481] rounded-br-full"></div>
    </section>
  );
}
