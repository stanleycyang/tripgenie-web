import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
              <div className="relative w-10 h-10">
                <Image
                  src="/icon.png"
                  alt="TripGenie Logo"
                  width={40}
                  height={40}
                  className="rounded-xl"
                />
              </div>
              <span className="text-2xl font-bold text-white">TripGenie</span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Your AI-powered travel genie. Plan your dream trip with AI, book everything in one place, and save your favorite itineraries.
            </p>
          </div>
          
          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="hover:text-[#ec7a1c] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#destinations" className="hover:text-[#ec7a1c] transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/create-trip" className="hover:text-[#ec7a1c] transition-colors">
                  Start Planning
                </Link>
              </li>
              <li>
                <Link href="/download" className="hover:text-[#ec7a1c] transition-colors">
                  Download App
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-[#ec7a1c] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#ec7a1c] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#ec7a1c] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#ec7a1c] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} TripGenie. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="https://twitter.com/tripgenie" className="hover:text-[#ec7a1c] transition-colors">
              Twitter
            </Link>
            <Link href="https://instagram.com/tripgenie" className="hover:text-[#ec7a1c] transition-colors">
              Instagram
            </Link>
            <Link href="https://facebook.com/tripgenie" className="hover:text-[#ec7a1c] transition-colors">
              Facebook
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
