import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import EventList from '../components/Events/EventList';
import { Event } from '../types';
import { eventsApi } from '../services/api';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
      <div className="page-container">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">All Events</h1>
            <p className="text-gray-600">
              Discover and register for upcoming events
            </p>
          </div>
        </div>
        
        <EventList events={events} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default EventsPage;