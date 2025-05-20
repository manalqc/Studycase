import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import EventList from '../components/Events/EventList';
import { Event } from '../types';
import { eventsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useAuth();
  
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await eventsApi.getAll();
        if (response.success) {
          setEvents(response.data);
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
      <section className="relative py-20 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              Find and manage events with ease
            </h1>
            <p className="text-xl opacity-90 mb-8 animate-fade-in">
              SmartEvent helps you discover, organize, and register for the events that matter to you.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in">
              <Link to="/events" className="px-6 py-3 bg-white text-primary-600 font-medium rounded-md shadow-md hover:bg-gray-50 transition-colors">
                Explore Events
              </Link>
              {isAuthenticated && isAdmin && (
                <Link to="/admin/events/new" className="px-6 py-3 bg-secondary-500 text-white font-medium rounded-md shadow-md hover:bg-secondary-600 transition-colors">
                  Create Event
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <Calendar className="w-full h-full" />
          </div>
        </div>
      </section>
      
      {/* Featured Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold gradient-text">Upcoming Events</h2>
            <Link
              to="/events"
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <EventList events={events.slice(0, 6)} isLoading={isLoading} />
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 gradient-text">
              Everything you need for successful events
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              SmartEvent provides a complete platform for organizing and discovering events of all types and sizes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Management</h3>
              <p className="text-gray-600">
                Create and manage events with comprehensive tools for scheduling, registration, and attendee management.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-secondary-600"
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
              <p className="text-gray-600">
                Simple registration process for attendees with automatic confirmation and capacity management.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-primary-600"
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
              <p className="text-gray-600">
                Track registrations, analyze attendance trends, and gather valuable insights about your events.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call-to-Action Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start managing events?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
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