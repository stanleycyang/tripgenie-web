'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Animated counter component
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
  const [activeDestination, setActiveDestination] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate destinations
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDestination((prev) => (prev + 1) % destinations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const destinations = [
    {
      name: 'Tokyo',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
      tagline: 'Where tradition meets tomorrow',
      temp: '16°C',
      rating: 4.9,
    },
    {
      name: 'Paris',
      country: 'France', 
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
      tagline: 'The city of eternal romance',
      temp: '12°C',
      rating: 4.8,
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
      tagline: 'Paradise found in every corner',
      temp: '27°C',
      rating: 4.9,
    },
    {
      name: 'Santorini',
      country: 'Greece',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200&q=80',
      tagline: 'Sunsets that steal your heart',
      temp: '20°C',
      rating: 4.9,
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Travel Blogger',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
      quote: 'TripGenie planned my 2-week Japan trip in minutes. Every restaurant, every experience was perfect. It felt like magic.',
      trip: 'Tokyo & Kyoto',
    },
    {
      name: 'Marcus Johnson',
      role: 'Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
      quote: 'I hate planning trips. Now I just tell TripGenie what I want and book everything in one tap. Game changer.',
      trip: 'Barcelona',
    },
    {
      name: 'Emma Williams',
      role: 'Marketing Director',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
      quote: 'Planned our honeymoon to Bali. The AI knew exactly what we wanted before we did. Absolutely incredible.',
      trip: 'Bali & Lombok',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ec7a1c] to-[#f5bc78] p-2 group-hover:scale-110 transition-transform">
              <span className="text-xl">🧞</span>
            </div>
            <span className="text-xl font-bold">TripGenie</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
            <a href="#destinations" className="text-white/70 hover:text-white transition-colors">Destinations</a>
            <a href="#how-it-works" className="text-white/70 hover:text-white transition-colors">How It Works</a>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-white/70 hover:text-white transition-colors">
              Sign In
            </button>
            <button className="bg-gradient-to-r from-[#ec7a1c] to-[#f5bc78] px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-[#ec7a1c]/30 transition-all hover:scale-105">
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Animated background */}
        <div className="absolute inset-0">
          {destinations.map((dest, i) => (
            <div
              key={dest.name}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                i === activeDestination ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-white/80">AI-powered travel planning</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Your wish is our
              <span className="block bg-gradient-to-r from-[#ec7a1c] via-[#f5bc78] to-[#ec7a1c] bg-clip-text text-transparent">
                itinerary
              </span>
            </h1>
            
            <p className="text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
              Tell us your dream destination. Our AI genie crafts a personalized itinerary 
              in seconds — hotels, flights, experiences, all bookable in one tap.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <button className="group bg-gradient-to-r from-[#ec7a1c] to-[#dd6012] px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-[#ec7a1c]/30 transition-all hover:scale-105 flex items-center justify-center gap-2">
                <span>✨</span>
                Start Planning
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
              <button className="px-8 py-4 rounded-full font-semibold text-lg border border-white/30 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <span>▶</span>
                Watch Demo
              </button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
              <div>
                <div className="text-3xl font-bold text-[#ec7a1c]">
                  <AnimatedNumber value={50} suffix="K+" />
                </div>
                <div className="text-sm text-white/50">Trips Planned</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#ec7a1c]">
                  <AnimatedNumber value={150} suffix="+" />
                </div>
                <div className="text-sm text-white/50">Destinations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#ec7a1c]">4.9</div>
                <div className="text-sm text-white/50">App Rating</div>
              </div>
            </div>
          </div>

          {/* Right: Destination Showcase */}
          <div className="hidden lg:block relative">
            <div className="relative w-full aspect-[4/5] max-w-md mx-auto">
              {/* Main card */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                <Image
                  src={destinations[activeDestination].image}
                  alt={destinations[activeDestination].name}
                  fill
                  className="object-cover transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Card content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[#ec7a1c] text-sm font-medium uppercase tracking-wider">
                      {destinations[activeDestination].country}
                    </span>
                    <span className="text-white/50">•</span>
                    <span className="text-white/50 text-sm">{destinations[activeDestination].temp}</span>
                  </div>
                  <h3 className="text-4xl font-bold mb-2">{destinations[activeDestination].name}</h3>
                  <p className="text-white/70 mb-4">{destinations[activeDestination].tagline}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-semibold">{destinations[activeDestination].rating}</span>
                      <span className="text-white/50 text-sm">(2.4k reviews)</span>
                    </div>
                    <button className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
                      Explore →
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ec7a1c] to-[#f5bc78] flex items-center justify-center">
                    <span>🎯</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold">AI Optimized</div>
                    <div className="text-xs text-white/50">Best route planned</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                    ✓
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Instant Booking</div>
                    <div className="text-xs text-white/50">One-tap checkout</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Destination indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {destinations.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDestination(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === activeDestination ? 'w-8 bg-[#ec7a1c]' : 'w-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-white/40">
            <span className="text-sm uppercase tracking-wider">Featured in</span>
            <span className="text-xl font-semibold">TechCrunch</span>
            <span className="text-xl font-semibold">Forbes</span>
            <span className="text-xl font-semibold">Wired</span>
            <span className="text-xl font-semibold">The Verge</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-[#ec7a1c] text-sm font-semibold uppercase tracking-wider">Features</span>
            <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              Planning trips is now
              <span className="block text-white/50">effortless</span>
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Our AI handles the complexity so you can focus on the excitement of your journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🤖', title: 'AI-Powered Planning', desc: 'Personalized itineraries in seconds, tailored to your travel style and preferences.' },
              { icon: '🏨', title: 'One-Tap Booking', desc: 'Hotels, flights, restaurants, and experiences — all bookable without leaving the app.' },
              { icon: '💰', title: 'Best Price Guarantee', desc: 'We compare across hundreds of providers to find you the best deals.' },
              { icon: '📍', title: 'Local Insights', desc: 'Hidden gems and authentic experiences that only locals know about.' },
              { icon: '⚡', title: 'Real-Time Updates', desc: 'Flight delays, weather changes, local events — stay informed instantly.' },
              { icon: '🔄', title: 'Flexible Changes', desc: 'Plans change. Easily modify your itinerary anytime, hassle-free.' },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#ec7a1c]/50 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ec7a1c]/20 to-[#f5bc78]/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ec7a1c]/10 via-transparent to-[#f5bc78]/10" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-[#ec7a1c] text-sm font-semibold uppercase tracking-wider">How It Works</span>
            <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
              Three wishes, one perfect trip
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Make a Wish', desc: 'Tell us where, when, and what kind of experience you want. Be as detailed as you like.', icon: '💭' },
              { step: '02', title: 'Magic Happens', desc: 'Our AI genie analyzes millions of options to create your perfect personalized itinerary.', icon: '✨' },
              { step: '03', title: 'Book & Go', desc: 'Review your itinerary, make tweaks if needed, and book everything with one tap.', icon: '🚀' },
            ].map((item, i) => (
              <div key={i} className="relative">
                {i < 2 && (
                  <div className="hidden md:block absolute top-20 left-full w-full h-px bg-gradient-to-r from-[#ec7a1c] to-transparent z-0" />
                )}
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#ec7a1c] to-[#dd6012] text-4xl mb-6 shadow-lg shadow-[#ec7a1c]/30">
                    {item.icon}
                  </div>
                  <div className="text-[#ec7a1c] text-sm font-bold mb-2">{item.step}</div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-white/50 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-[#ec7a1c] text-sm font-semibold uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl md:text-6xl font-bold mt-4">
              Travelers love us
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-white/50">{t.role}</div>
                  </div>
                </div>
                <p className="text-white/70 leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-2 text-sm text-[#ec7a1c]">
                  <span>📍</span>
                  <span>{t.trip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ec7a1c] to-[#dd6012]" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#ec7a1c] via-transparent to-[#ec7a1c]/50" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm text-5xl mb-8">
            🧞
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready for your next adventure?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of travelers who've discovered the magic of AI-powered trip planning. 
            Your dream vacation is just one wish away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#ec7a1c] px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105">
              Start Planning Free
            </button>
            <button className="border-2 border-white/50 px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all">
              Download App
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ec7a1c] to-[#f5bc78] p-2">
                  <span className="text-xl">🧞</span>
                </div>
                <span className="text-xl font-bold">TripGenie</span>
              </Link>
              <p className="text-white/50 text-sm leading-relaxed">
                AI-powered travel planning that turns your dreams into perfectly crafted itineraries.
              </p>
            </div>
            
            {[
              { title: 'Product', links: ['Features', 'Destinations', 'Pricing', 'Mobile App'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Privacy', 'Terms'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
            <p className="text-white/30 text-sm">
              © 2026 TripGenie. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                <a key={social} href="#" className="text-white/30 hover:text-white transition-colors text-sm">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(8px); opacity: 0; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 0.5s;
        }
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
