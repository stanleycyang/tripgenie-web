'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Animated counter
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const destinations = [
    {
      name: 'Tokyo',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      price: 'From $89/night',
      rating: 4.97,
      reviews: 2847,
    },
    {
      name: 'Paris',
      country: 'France', 
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      price: 'From $120/night',
      rating: 4.92,
      reviews: 3291,
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      price: 'From $45/night',
      rating: 4.95,
      reviews: 1823,
    },
    {
      name: 'Santorini',
      country: 'Greece',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
      price: 'From $150/night',
      rating: 4.98,
      reviews: 1456,
    },
  ];

  const features = [
    { icon: '✨', title: 'AI-Powered', desc: 'Get personalized itineraries in seconds' },
    { icon: '🏨', title: 'One-Tap Booking', desc: 'Hotels, flights, experiences—all in one place' },
    { icon: '💰', title: 'Best Prices', desc: 'Compare hundreds of providers automatically' },
    { icon: '📍', title: 'Local Gems', desc: 'Discover places only locals know about' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ec7a1c] to-[#f09742] flex items-center justify-center shadow-md shadow-orange-200">
              <span className="text-xl">🧞</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TripGenie</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#destinations" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Destinations</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">How It Works</a>
            <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="hidden sm:block px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-full transition-colors">
              Log in
            </button>
            <button className="bg-[#ec7a1c] hover:bg-[#dd6012] text-white px-5 py-2.5 rounded-full font-semibold shadow-md shadow-orange-200 hover:shadow-lg hover:shadow-orange-300 transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20">
        {/* Hero Image */}
        <div className="relative h-[600px] md:h-[700px]">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
            alt="Beautiful tropical beach destination"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
          
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Your wish is our
                  <span className="block text-[#f5bc78]">itinerary</span>
                </h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Tell us your dream destination. Our AI genie crafts a personalized trip 
                  in seconds—hotels, flights, experiences, all bookable in one tap.
                </p>
                
                {/* Search Bar */}
                <div className="bg-white rounded-full p-2 shadow-xl flex items-center max-w-xl">
                  <div className="flex-1 px-4">
                    <div className="text-xs text-gray-500 font-medium">Where to?</div>
                    <input 
                      type="text" 
                      placeholder="Search destinations..." 
                      className="w-full text-gray-900 font-medium outline-none bg-transparent"
                    />
                  </div>
                  <button className="bg-[#ec7a1c] hover:bg-[#dd6012] text-white p-4 rounded-full transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 md:gap-16">
              <div className="text-center md:text-left">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  <AnimatedNumber value={50} suffix="K+" />
                </div>
                <div className="text-sm text-gray-500">Trips Planned</div>
              </div>
              <div className="hidden md:block w-px h-10 bg-gray-200" />
              <div className="text-center md:text-left">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">
                  <AnimatedNumber value={150} suffix="+" />
                </div>
                <div className="text-sm text-gray-500">Destinations</div>
              </div>
              <div className="hidden md:block w-px h-10 bg-gray-200" />
              <div className="text-center md:text-left">
                <div className="text-2xl md:text-3xl font-bold text-gray-900">4.9</div>
                <div className="text-sm text-gray-500">App Store Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{feature.title}</div>
                  <div className="text-sm text-gray-500">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section id="destinations" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Popular destinations
              </h2>
              <p className="text-gray-500 text-lg">Explore trending places loved by travelers</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-[#ec7a1c] font-semibold hover:underline">
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, i) => (
              <div 
                key={i}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-3">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{dest.name}, {dest.country}</h3>
                    <p className="text-gray-500 text-sm">{dest.price}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-[#ec7a1c]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{dest.rating}</span>
                    <span className="text-sm text-gray-400">({dest.reviews.toLocaleString()})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Three wishes, one perfect trip
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Planning your dream vacation has never been this easy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { 
                step: '01', 
                icon: '💭',
                title: 'Make a wish', 
                desc: 'Tell us where you want to go, when, and what kind of experience you\'re looking for.' 
              },
              { 
                step: '02', 
                icon: '✨',
                title: 'Magic happens', 
                desc: 'Our AI analyzes millions of options to create your perfect personalized itinerary.' 
              },
              { 
                step: '03', 
                icon: '🚀',
                title: 'Book & go', 
                desc: 'Review your itinerary, make tweaks if needed, and book everything with one tap.' 
              },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-orange-200 to-transparent" />
                )}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white shadow-lg shadow-gray-200/50 text-4xl mb-6 relative">
                  {item.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#ec7a1c] text-white text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80"
              alt="Travel adventure"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#ec7a1c]/90 to-[#dd6012]/80" />
            
            <div className="relative px-8 py-16 md:px-16 md:py-24 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm text-4xl mb-8">
                🧞
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
                Ready for your next adventure?
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join 50,000+ travelers who've discovered the magic of AI-powered trip planning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-[#ec7a1c] px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105">
                  Start Planning — It's Free
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                  Download App
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by travelers
            </h2>
            <p className="text-gray-500 text-lg">See what people are saying about TripGenie</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Chen',
                role: 'Travel Blogger',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                quote: 'TripGenie planned my 2-week Japan trip in minutes. Every restaurant, every experience was perfect.',
                location: 'Tokyo & Kyoto',
              },
              {
                name: 'Marcus Johnson',
                role: 'Software Engineer',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                quote: 'I hate planning trips. Now I just tell TripGenie what I want and book everything in one tap.',
                location: 'Barcelona',
              },
              {
                name: 'Emma Williams',
                role: 'Marketing Director',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
                quote: 'Planned our honeymoon to Bali. The AI knew exactly what we wanted before we did.',
                location: 'Bali & Lombok',
              },
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-2 text-sm text-[#ec7a1c] font-medium">
                  <span>📍</span>
                  <span>{t.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ec7a1c] to-[#f09742] flex items-center justify-center">
                  <span className="text-xl">🧞</span>
                </div>
                <span className="text-xl font-bold text-gray-900">TripGenie</span>
              </Link>
              <p className="text-gray-500 leading-relaxed max-w-xs">
                AI-powered travel planning that turns your dreams into perfectly crafted itineraries.
              </p>
            </div>
            
            {[
              { title: 'Product', links: ['How it Works', 'Destinations', 'Mobile App', 'Pricing'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Privacy', 'Terms'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold text-gray-900 mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t">
            <p className="text-gray-400 text-sm">
              © 2026 TripGenie. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-gray-600 transition-colors text-sm">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
