// components/HowItWorks.tsx

import Image from 'next/image';

export default function HowItWorks() {
  return (
   <section className=" py-16 px-6">
      <h2 className="text-4xl text-center mb-18 font-bold">How It Works</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        <div className="flex flex-col items-center">
          <Image src="/signup.png" alt="Step 1" width={50} height={50} />
          <br/>
          <p className="text-center">Sign Up and Create Your Profile</p>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/services.png" alt="Step 2" width={50} height={50} />
          <br/>
          <p className="text-center">Browse Service Requests and Offers</p>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/exchange.png" alt="Step 3" width={50} height={50} />
          <br/>
          <p className="text-center">Exchange Your Time Credits</p>
        </div>
        <div className="flex flex-col items-center">
          <Image src="/help.png" alt="Step 4" width={50} height={50} />
          <br/>
          <p className="text-center">Request Help from Others</p>
        </div>
      </div>
    </section>
  );
}
