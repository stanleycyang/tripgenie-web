import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/Button';
import { DestinationCard } from '@/components/DestinationCard';

export default function LandingPage() {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Planning',
      description: 'Our AI analyzes your preferences and creates personalized itineraries tailored just for you.',
    },
    {
      icon: '🏨',
      title: 'Book Everything',
      description: 'Hotels, flights, activities, and experiences - all in one place. No more tab switching.',
    },
    {
      icon: '💾',
      title: 'Save & Share Trips',
      description: 'Keep all your trips organized and easily share itineraries with friends and family.',
    },
    {
      icon: '⚡',
      title: 'Real-Time Updates',
      description: 'Get instant notifications about flight changes, weather updates, and local events.',
    },
    {
      icon: '🌍',
      title: 'Global Coverage',
      description: 'Explore destinations worldwide with local insights and authentic recommendations.',
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Compare prices across multiple providers to get the best deals on your bookings.',
    },
  ];

  const destinations = [
    {
      name: 'Tokyo',
      country: 'Japan',
      imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      description: 'Ancient temples meet futuristic technology in this vibrant metropolis.',
    },
    {
      name: 'Paris',
      country: 'France',
      imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      description: 'Romance, art, and culture await in the City of Light.',
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      description: 'Tropical paradise with pristine beaches and spiritual temples.',
    },
    {
      name: 'New York',
      country: 'USA',
      imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
      description: 'The city that never sleeps offers endless entertainment and culture.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
            alt="Travel Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 py-32 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
              <div className="relative w-8 h-8">
                <Image
                  src="/icon.png"
                  alt="TripGenie"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <span className="text-white/90 text-sm font-medium">Your AI Travel Assistant</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Plan your dream trip
              <br />
              <span className="text-[#ec7a1c]">with AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
              Tell us what you want, and our AI genie will create the perfect itinerary. 
              Book hotels, flights, and activities - all in one magical place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={() => window.location.href = '/create-trip'}>
                ✨ Start Planning Now
              </Button>
              <Button variant="ghost" size="lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Learn More →
              </Button>
            </div>
            
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>Personalized for you</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need for the perfect trip
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From planning to booking to experiencing - we've got you covered every step of the way.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Popular Destinations */}
      <section id="destinations" className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the most loved destinations around the world, curated by travelers like you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {destinations.map((destination, index) => (
              <DestinationCard key={index} {...destination} />
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="secondary" onClick={() => window.location.href = '/destinations'}>
              View All Destinations
            </Button>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Planning your perfect trip is as easy as 1-2-3
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#ec7a1c] rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">Tell Us Your Dream</h3>
              <p className="text-gray-300 leading-relaxed">
                Share your travel preferences, dates, budget, and what you want to experience. The more details, the better!
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-[#ec7a1c] rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Creates Magic</h3>
              <p className="text-gray-300 leading-relaxed">
                Our AI analyzes thousands of options and creates a personalized itinerary with hotels, flights, and activities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-[#ec7a1c] rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">Book & Enjoy</h3>
              <p className="text-gray-300 leading-relaxed">
                Review your perfect itinerary, make any tweaks, and book everything with one click. Then just enjoy your trip!
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#ec7a1c] to-[#dd6012] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to plan your dream trip?
          </h2>
          <p className="text-xl mb-10 text-white/90 leading-relaxed">
            Join thousands of travelers who've discovered their perfect adventures with TripGenie. 
            Your next unforgettable journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => window.location.href = '/create-trip'}
            >
              🚀 Start Planning for Free
            </Button>
            <Button 
              size="lg" 
              variant="ghost"
              onClick={() => window.location.href = '/download'}
            >
              📱 Download Mobile App
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
