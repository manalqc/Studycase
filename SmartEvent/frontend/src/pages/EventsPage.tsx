import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import EventList from '../components/Events/EventList';
import { Event } from '../types';
import { eventsApi } from '../services/api';
import { Search, Filter, Calendar } from 'lucide-react';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const categories = ['Conference', 'Workshop', 'Seminar', 'Networking', 'Other'];
  
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
  
  // Filter events based on search term and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? event.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="border-b-2 border-black pb-6 mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Discover Events</h1>
          <p className="text-black text-lg">
            Find and register for exciting upcoming events
          </p>
        </div>
        
        {/* Search and filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search bar */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-orange-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border-2 border-black rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category filter */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-orange-500" />
              </div>
              <select
                className="block w-full pl-10 pr-3 py-2 border-2 border-black rounded-md bg-white focus:ring-orange-500 focus:border-orange-500 appearance-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Results count */}
          <div className="flex items-center text-black">
            <Calendar className="h-5 w-5 text-orange-500 mr-2" />
            <span>
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
            </span>
          </div>
        </div>
        
        {/* Event list */}
        <div className="bg-white rounded-lg border-2 border-black p-6">
          <EventList events={filteredEvents} isLoading={isLoading} />
          
          {/* Empty state */}
          {!isLoading && filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-orange-500 mb-4">
                <Calendar className="h-full w-full" />
              </div>
              <h3 className="text-xl font-medium text-black mb-2">No events found</h3>
              <p className="text-black">
                {searchTerm || selectedCategory ? 
                  'Try adjusting your search or filters' : 
                  'Check back later for upcoming events'}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EventsPage;