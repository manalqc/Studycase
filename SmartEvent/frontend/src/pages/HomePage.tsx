import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import EventList from '../components/Events/EventList';
import { Event } from '../types';
import { eventsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useAuth();
  
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await eventsApi.getAll();
        if (response.success) {
          const allEvents = response.data;
          setEvents(allEvents);
          
          // Get unique categories
          const uniqueCategories = Array.from(new Set(allEvents.map(event => event.category)));
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center bg-white overflow-hidden border-b border-gray-200">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat bg-center" />
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-black space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Find and manage events with ease
              </h1>
              <p className="text-xl text-gray-700 max-w-lg">
                SmartEvent helps you discover, organize, and register for the events that matter to you.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/events"
                  className="bg-orange-500 text-white text-lg px-8 py-3 rounded-full hover:scale-105 transition-all"
                >
                  Explore Events
                </Link>
                {!isAuthenticated && (
                  <Link
                    to="/register"
                    className="btn-secondary text-lg px-8 py-3 rounded-full hover:scale-105 transition-all"
                  >
                    Sign Up Free
                  </Link>
                )}
                {isAuthenticated && isAdmin && (
                  <Link
                    to="/admin/events/new"
                    className="btn-secondary text-lg px-8 py-3 rounded-full hover:scale-105 transition-all"
                  >
                    Create Event
                  </Link>
                )}
              </div>
            </motion.div>
            
            {/* Search Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-xl"
            >
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Find Your Next Event</h2>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <Link to="/events" className="block w-full text-center bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition-colors">
                  Search Events
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* All Events Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-black">All Events</h2>
              <p className="mt-2 text-black">Browse and discover more events</p>
            </div>
          </div>
          <EventList events={events} isLoading={isLoading} />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black">Why Choose SmartEvent?</h2>
            <p className="mt-4 text-xl text-black max-w-3xl mx-auto">
              Our platform offers everything you need to manage your events efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-black hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Management</h3>
              <p className="text-black">
                Create and manage events with comprehensive tools for scheduling, registration, and attendee management.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-black hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-orange-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Registration</h3>
              <p className="text-black">
                Simple registration process for attendees with automatic confirmation and capacity management.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-black hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-orange-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-black">
                Track registrations, analyze attendance trends, and gather valuable insights about your events.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call-to-Action Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start managing events?</h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Join SmartEvent today and discover how easy it can be to create and manage your events.
          </p>
          {isAuthenticated ? (
            <Link
              to="/events"
              className="px-6 py-3 bg-white text-primary-600 font-medium rounded-md shadow-md hover:bg-gray-50 transition-colors inline-block"
            >
              Explore Events
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-6 py-3 bg-white text-primary-600 font-medium rounded-md shadow-md hover:bg-gray-50 transition-colors inline-block"
            >
              Get Started
            </Link>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;