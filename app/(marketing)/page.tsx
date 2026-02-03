'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Star, ChevronDown, ChevronUp, Shield, Clock, Globe, Sparkles, Check, ArrowRight, Play, Users, TrendingUp, Award, Zap, Calendar, Minus, Plus, X, Loader2 } from 'lucide-react';

const destinations = [
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', price: 89 },
  { id: 'paris', name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', price: 120 },
  { id: 'bali', name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', price: 45 },
  { id: 'santorini', name: 'Santorini', country: 'Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80', price: 150 },
];

const travelerTypes = [
  { id: 'solo', label: 'Solo', icon: '🧑' },
  { id: 'couple', label: 'Couple', icon: '💑' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'friends', label: 'Friends', icon: '👯' },
];

const vibeOptions = [
  { id: 'adventure', label: 'Adventure', emoji: '🏔️' },
  { id: 'relaxation', label: 'Relaxation', emoji: '🏖️' },
  { id: 'cultural', label: 'Cultural', emoji: '🏛️' },
  { id: 'foodie', label: 'Foodie', emoji: '🍜' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🌃' },
  { id: 'romantic', label: 'Romantic', emoji: '💕' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
];

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return <>{count.toLocaleString()}{suffix}</>;
}

function LiveActivity() {
  const [count, setCount] = useState(127);
  useEffect(() => {
    const interval = setInterval(() => setCount(prev => prev + Math.floor(Math.random() * 3) - 1), 3000);
    return () => clearInterval(interval);
  }, []);
  return count;
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Trip creation state
  const [destination, setDestination] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [travelers, setTravelers] = useState(2);
  const [travelerType, setTravelerType] = useState('couple');
  const [selectedVibes, setSelectedVibes] = useState<string[]>(['cultural', 'foodie']);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  const [error, setError] = useState('');

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDestinations = searchQuery
    ? destinations.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.country.toLowerCase().includes(searchQuery.toLowerCase()))
    : destinations;

  const toggleVibe = (vibeId: string) => {
    setSelectedVibes(prev => 
      prev.includes(vibeId) ? prev.filter(v => v !== vibeId) : prev.length < 5 ? [...prev, vibeId] : prev
    );
  };

  const canGenerate = destination && startDate && endDate;

  const getTripDuration = () => {
    if (!startDate || !endDate) return null;
    const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return days;
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    
    setIsGenerating(true);
    setError('');
    setGeneratedItinerary(null);
    setGenerationProgress('Analyzing your preferences...');

    try {
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          travelers: { adults: travelers, children: 0 },
          vibes: selectedVibes,
          budget: 'moderate',
          save: false, // Don't save without auth
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate itinerary');
      }

      setGenerationProgress('Creating your personalized itinerary...');
      const itinerary = await response.json();
      setGeneratedItinerary(itinerary);
      setGenerationProgress('');
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      // Show mock data for demo if API fails
      setGenerationProgress('');
      setGeneratedItinerary({
        destination,
        startDate,
        endDate,
        overview: `Your ${getTripDuration()}-day adventure in ${destination} awaits! This AI-generated itinerary is tailored to your ${selectedVibes.join(', ')} vibes.`,
        days: Array.from({ length: getTripDuration() || 3 }, (_, i) => ({
          dayNumber: i + 1,
          title: `Day ${i + 1}: ${i === 0 ? 'Arrival & Exploration' : i === (getTripDuration() || 3) - 1 ? 'Final Adventures' : 'Full Day of Discovery'}`,
          summary: `Exciting activities planned for day ${i + 1} of your ${destination} trip.`,
        })),
        _demo: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
              <button className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/90 hover:text-white'}`}>Log in</button>
              <button className="bg-primary hover:bg-primary-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl transition-all">Sign up free</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Inline Trip Creator */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80" alt="Dream destination" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-gray-900/30" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-white/90 text-sm font-medium"><LiveActivity /> travelers planning now</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
                Plan your perfect trip
                <span className="block mt-2 bg-gradient-to-r from-primary-300 via-primary-200 to-amber-200 bg-clip-text text-transparent">in 60 seconds</span>
              </h1>
              
              <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
                AI-powered itineraries tailored to your style. Hotels, flights, activities—all bookable in one tap.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-white" />
                    ))}
                  </div>
                  <span className="text-white/80 text-sm font-medium">50K+ travelers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-white font-semibold">4.9</span>
                  <span className="text-white/60 text-sm">(12K reviews)</span>
                </div>
              </div>
            </div>

            {/* Right: Trip Creation Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Create your itinerary</h2>
                  <p className="text-sm text-gray-500">AI-powered, personalized for you</p>
                </div>
              </div>

              {/* Destination Input */}
              <div className="mb-4" ref={searchRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">Where to?</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={destination || searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setDestination(''); setShowDestDropdown(true); }}
                    onFocus={() => setShowDestDropdown(true)}
                    placeholder="Search destinations..."
                    className="w-full pl-12 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  {(destination || searchQuery) && (
                    <button onClick={() => { setDestination(''); setSearchQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                  
                  {showDestDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20 max-h-64 overflow-y-auto">
                      {filteredDestinations.map((dest) => (
                        <button
                          key={dest.id}
                          onClick={() => { setDestination(dest.name); setSearchQuery(''); setShowDestDropdown(false); }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={dest.image} alt={dest.name} width={48} height={48} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">{dest.name}</p>
                            <p className="text-sm text-gray-500">{dest.country}</p>
                          </div>
                          {destination === dest.name && <Check className="w-5 h-5 text-primary ml-auto" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check in</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Trip duration badge */}
              {getTripDuration() && destination && (
                <div className="mb-4 p-3 bg-primary-50 rounded-xl flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <p className="text-sm text-primary-700 font-medium">
                    {getTripDuration()} day{getTripDuration()! > 1 ? 's' : ''} in {destination}
                  </p>
                </div>
              )}

              {/* Advanced Options Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between py-3 text-gray-600 hover:text-gray-900 transition-colors mb-4"
              >
                <span className="text-sm font-medium">Customize your trip</span>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Advanced Options */}
              {showAdvanced && (
                <div className="space-y-4 mb-6 pt-4 border-t border-gray-100">
                  {/* Travelers */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Travelers</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setTravelers(Math.max(1, travelers - 1))} disabled={travelers <= 1} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary disabled:opacity-50">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-semibold">{travelers}</span>
                      <button onClick={() => setTravelers(Math.min(10, travelers + 1))} disabled={travelers >= 10} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary disabled:opacity-50">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Traveler Type */}
                  <div>
                    <span className="text-sm font-medium text-gray-700 block mb-2">Trip type</span>
                    <div className="flex flex-wrap gap-2">
                      {travelerTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setTravelerType(type.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                            travelerType === type.id ? 'bg-primary-50 text-primary-700 border-2 border-primary' : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-200'
                          }`}
                        >
                          <span>{type.icon}</span>
                          <span className="font-medium">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vibes */}
                  <div>
                    <span className="text-sm font-medium text-gray-700 block mb-2">Travel vibes</span>
                    <div className="flex flex-wrap gap-2">
                      {vibeOptions.map((vibe) => (
                        <button
                          key={vibe.id}
                          onClick={() => toggleVibe(vibe.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ${
                            selectedVibes.includes(vibe.id) ? 'bg-primary-50 text-primary-700 border-2 border-primary' : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-200'
                          }`}
                        >
                          <span>{vibe.emoji}</span>
                          <span className="font-medium">{vibe.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  canGenerate && !isGenerating
                    ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {generationProgress || 'Generating...'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate My Itinerary
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-3">
                Free • No sign-up required • AI-powered
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Generated Itinerary Preview */}
      {generatedItinerary && (
        <section className="py-16 bg-gradient-to-b from-primary-50 to-white" id="itinerary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Check className="w-4 h-4" />
                Itinerary Generated!
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your {getTripDuration()}-Day {destination} Adventure
              </h2>
              <p className="text-gray-500">{generatedItinerary.overview}</p>
              {generatedItinerary._demo && (
                <p className="text-amber-600 text-sm mt-2">⚠️ Demo preview — connect AI Gateway API key for full itineraries</p>
              )}
            </div>

            <div className="space-y-4">
              {generatedItinerary.days?.map((day: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-700 font-bold">{day.dayNumber}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{day.title}</h3>
                      <p className="text-gray-500 text-sm">{day.summary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2">
                View Full Itinerary
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Social Proof Bar */}
      <section className="bg-gray-900 text-white py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 mx-6">
              <span className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-400" /> No booking fees</span>
              <span className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-400" /> Free cancellation</span>
              <span className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-400" /> Best price guarantee</span>
              <span className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-green-400" /> 24/7 support</span>
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
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">How TripGenie works</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">No more hours of research. Our AI does the heavy lifting.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              { step: '01', title: 'Enter your details', desc: 'Tell us where you want to go and when. Add your travel style for a personalized experience.', icon: '📝', color: 'from-blue-500 to-indigo-600' },
              { step: '02', title: 'AI creates your plan', desc: 'Our AI analyzes millions of data points to craft your perfect day-by-day itinerary.', icon: '✨', color: 'from-primary to-amber-500' },
              { step: '03', title: 'Book & enjoy', desc: 'Review your itinerary, make any tweaks, and book flights, hotels, activities in one click.', icon: '🚀', color: 'from-green-500 to-emerald-600' },
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
              </div>
            ))}
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
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, i) => (
              <div key={i} className="group cursor-pointer" onClick={() => { setDestination(dest.name); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                  <Image src={dest.image} alt={dest.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white">{dest.name}</h3>
                    <p className="text-white/80 text-sm">{dest.country}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-semibold">From ${dest.price}/night</span>
                  <span className="text-primary font-medium text-sm">Plan trip →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">TripGenie</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">AI-powered travel planning. Create perfect itineraries in seconds.</p>
            </div>
            {[
              { title: 'Product', links: ['How it Works', 'Pricing', 'Destinations'] },
              { title: 'Company', links: ['About', 'Blog', 'Careers'] },
              { title: 'Support', links: ['Help Center', 'Privacy', 'Terms'] },
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
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © 2026 TripGenie. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
      `}</style>
    </div>
  );
}
