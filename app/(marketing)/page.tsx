'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Star, ChevronRight, Shield, Clock, Globe, Sparkles, Check, ArrowRight, Play, Users, TrendingUp, Award, Zap } from 'lucide-react';

function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{prefix}{count.toLocaleString()}{suffix}</>;
}

function LiveActivity() {
  const [count, setCount] = useState(127);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return count;
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const suggestions = ['Tokyo, Japan', 'Paris, France', 'Bali, Indonesia', 'New York, USA', 'Barcelona, Spain'];
  const filteredSuggestions = suggestions.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

  const destinations = [
    { name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', price: 89, rating: 4.97, reviews: 2847, badge: 'Trending' },
    { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', price: 120, rating: 4.92, reviews: 3291, badge: 'Popular' },
    { name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', price: 45, rating: 4.95, reviews: 1823, badge: 'Best Value' },
    { name: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80', price: 150, rating: 4.98, reviews: 1456, badge: 'Romantic' },
  ];

  return (
    <div className="min-h-screen bg-white antialiased">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary to-primary-600 flex items-center justify-center shadow-lg shadow-primary/25">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className={`text-lg font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>TripGenie</span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-1">
              {['Destinations', 'How It Works', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isScrolled ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
                  {item}
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <button className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/90 hover:text-white'}`}>
                Log in
              </button>
              <button className="bg-primary hover:bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80" alt="Dream destination" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-gray-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-gray-900/20" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            {/* Live indicator */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-white/90 text-sm font-medium"><LiveActivity /> travelers planning trips right now</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Plan your perfect trip
              <span className="block mt-2 bg-gradient-to-r from-primary-300 via-primary-200 to-amber-200 bg-clip-text text-transparent">in 60 seconds</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl leading-relaxed">
              AI-powered itineraries tailored to your style. Hotels, flights, activities—all bookable in one tap.
            </p>

            {/* Search Box */}
            <div className="relative max-w-2xl">
              <div className="bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="Where do you want to go?"
                    className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-400 outline-none text-lg rounded-xl"
                  />
                  {showSuggestions && searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10">
                      {filteredSuggestions.map((s, i) => (
                        <button key={i} className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{s}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
                  <Sparkles className="w-5 h-5" />
                  <span>Create Itinerary</span>
                </button>
              </div>
              
              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-white/60 text-sm">Popular:</span>
                {['Tokyo', 'Paris', 'Bali', 'NYC'].map((place) => (
                  <button key={place} onClick={() => setSearchQuery(place)} className="text-white/80 hover:text-white text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-colors">
                    {place}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white" />
                  ))}
                </div>
                <span className="text-white/80 text-sm font-medium">50K+ happy travelers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-white font-semibold">4.9</span>
                <span className="text-white/60 text-sm">(12K reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-white/80 text-sm">Secure booking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="bg-gray-900 text-white py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 mx-6">
              <span className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-400" /> No booking fees</span>
              <span className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-400" /> Free cancellation</span>
              <span className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-400" /> Best price guarantee</span>
              <span className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-400" /> 24/7 support</span>
              <span className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-400" /> Verified reviews</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: 50000, suffix: '+', label: 'Trips Planned', icon: TrendingUp },
              { value: 150, suffix: '+', label: 'Destinations', icon: Globe },
              { value: 4.9, suffix: '', label: 'User Rating', icon: Star, isDecimal: true },
              { value: 60, suffix: 's', label: 'Avg. Planning Time', icon: Clock },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-50 mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">
                  {stat.isDecimal ? stat.value : <AnimatedCounter value={stat.value} suffix={stat.suffix} />}
                  {stat.isDecimal && stat.suffix}
                </div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Zap className="w-4 h-4" />
              Lightning Fast
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
              Create your itinerary in 3 steps
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              No more hours of research. Our AI does the heavy lifting.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              { step: '01', title: 'Tell us your dream', desc: 'Enter your destination, dates, and travel style. Add any specific interests or requirements.', icon: '💭', color: 'from-blue-500 to-indigo-600' },
              { step: '02', title: 'AI creates magic', desc: 'Our AI analyzes millions of data points to craft your perfect day-by-day itinerary.', icon: '✨', color: 'from-primary to-amber-500' },
              { step: '03', title: 'Book & enjoy', desc: 'Review, customize, and book everything—flights, hotels, activities—in one click.', icon: '🚀', color: 'from-green-500 to-emerald-600' },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                    {item.icon}
                  </div>
                  <div className="text-sm font-bold text-primary mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-semibold inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
              Try It Now — It's Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Trending destinations</h2>
              <p className="text-gray-500 text-lg">Hand-picked by our travel experts</p>
            </div>
            <button className="text-primary font-semibold hover:underline inline-flex items-center gap-1 self-start lg:self-auto">
              Explore all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                  <Image src={dest.image} alt={dest.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      {dest.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1 text-white mb-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{dest.rating}</span>
                      <span className="text-white/70 text-sm">({dest.reviews.toLocaleString()})</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                    <p className="text-white/80 text-sm">{dest.country}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-900 font-semibold">${dest.price}</span>
                    <span className="text-gray-500 text-sm"> / night avg.</span>
                  </div>
                  <button className="text-primary font-medium text-sm hover:underline">Plan trip →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-gray-900/90" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Award className="w-4 h-4" />
              #1 AI Travel Planner
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to plan your
              <span className="bg-gradient-to-r from-primary-300 to-amber-300 bg-clip-text text-transparent"> dream trip?</span>
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join 50,000+ travelers who save hours of planning with TripGenie's AI-powered itineraries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl transition-all hover:-translate-y-0.5">
                <Sparkles className="w-5 h-5" />
                Create Free Itinerary
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center justify-center gap-2 transition-all">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-6">No credit card required • Free forever for basic plans</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Loved by travelers worldwide</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map((i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
              </div>
              <span className="text-gray-600 font-medium">4.9 out of 5 based on 12,000+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Chen', role: 'Marketing Director', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', quote: 'TripGenie planned my 2-week Japan trip in under a minute. Every restaurant, every experience was spot-on. Absolute game changer!', trip: 'Tokyo & Kyoto', saved: '12 hours' },
              { name: 'Marcus Johnson', role: 'Software Engineer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', quote: 'I hate trip planning. Now I just tell TripGenie what I want and book everything in one tap. It\'s like having a personal travel agent.', trip: 'Barcelona', saved: '8 hours' },
              { name: 'Emma Williams', role: 'Travel Blogger', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80', quote: 'The AI recommended hidden gems I never would have found on my own. Our Bali honeymoon was absolutely magical.', trip: 'Bali', saved: '15 hours' },
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <Image src={t.image} alt={t.name} width={44} height={44} className="rounded-full" />
                    <div>
                      <div className="font-semibold text-gray-900">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Saved</div>
                    <div className="text-sm font-semibold text-green-600">{t.saved}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Start planning your next adventure</h2>
          <p className="text-gray-500 mb-8">No sign-up required. Get your personalized itinerary in seconds.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input type="text" placeholder="Enter destination..." className="flex-1 px-5 py-3 border border-gray-200 rounded-full outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            <button className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold whitespace-nowrap shadow-lg shadow-primary/20">
              Plan My Trip
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">TripGenie</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                AI-powered travel planning that creates perfect itineraries in seconds. No fees, no hassle.
              </p>
              <div className="flex items-center gap-4">
                <Image src="/app-store.svg" alt="App Store" width={120} height={40} className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer" onError={(e) => e.currentTarget.style.display = 'none'} />
                <Image src="/play-store.svg" alt="Play Store" width={120} height={40} className="opacity-80 hover:opacity-100 transition-opacity cursor-pointer" onError={(e) => e.currentTarget.style.display = 'none'} />
              </div>
            </div>
            {[
              { title: 'Product', links: ['How it Works', 'Pricing', 'Destinations', 'Mobile App'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Privacy', 'Terms'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}><a href="#" className="text-gray-400 hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">© 2026 TripGenie. All rights reserved.</p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map((s) => (
                <a key={s} href="#" className="text-gray-500 hover:text-white transition-colors text-sm">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
