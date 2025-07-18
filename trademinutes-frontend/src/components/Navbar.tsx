"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaBars } from "react-icons/fa";
import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

function Dropdown({ label, items }: { label: string; items: { name: string; href: string }[] }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center gap-1 hover:text-green-500">
        {label}
        <ChevronDownIcon className="w-4 h-4" />
      </Menu.Button>

      <Menu.Items className="absolute z-50 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
        <div className="py-1">
          {items.map((item, idx) => (
            <Menu.Item key={idx}>
              {({ active }) => (
                <Link
                  href={item.href}
                  className={`block px-4 py-2 text-sm ${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    setToken(t);
    const fetchCredits = async () => {
      if (!t) return;
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8084';
        const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${t}` },
        });
        if (res.ok) {
          const profile = await res.json();
          setCredits(profile.Credits ?? profile.credits ?? null);
        }
      } catch {}
    };
    fetchCredits();
  }, [pathname]);

  return (
    <header className="bg-white shadow-md text-black w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
        {/* Logo on left */}
        <Link href="/" className="text-xl font-bold">
          <span className="text-black">TradeMinutes.</span>
        </Link>

        {/* Spacer pushes the right section */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          {/* Nav dropdowns */}
          <nav className="flex gap-6 text-sm font-medium items-center">
           
            <Dropdown
              label="Browse Services"
              items={[
                { name: "By Category", href: "/services/category" },
                { name: "All Services", href: "/services/all" },
              ]}
            />
            <Dropdown
              label="Users"
              items={[
                { name: "Top Rated", href: "/users/top" },
                { name: "Nearby", href: "/users/nearby" },
              ]}
            />
           <Link href="/about" className="hover:text-green-600">About</Link>
            <Link href="/contact" className="hover:text-green-600">Contact</Link>
          </nav>
          {/* Credits badge removed */}
          {/* Right buttons */}
          <Link href="/seller" className="hover:text-green-600 text-sm">Become a Seller</Link>
          <Link href="/login" className="hover:text-green-600 text-sm">Sign in</Link>
          <Link href="/register">
            <button className="bg-green-500 text-white text-sm px-4 py-2 rounded hover:bg-green-600">
              Join
            </button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden ml-auto text-black">
          <FaBars size={20} />
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white px-4 py-4 space-y-3 shadow-md text-sm">
        
          <Link href="/jobs">Browse Services</Link>
          <Link href="/users">Users</Link>
          <Link href="/about">Pages</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login">Sign in</Link>
          <Link href="/register">
            <button className="w-full bg-green-500 text-white py-2 rounded">Join</button>
          </Link>
        </div>
      )}
    </header>
  );
}
