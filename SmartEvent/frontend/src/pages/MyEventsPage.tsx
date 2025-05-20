import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, AlertTriangle, Ticket, ChevronRight, XCircle } from 'lucide-react';
import LayoutNoFooter from '../components/Layout/LayoutNoFooter';
import { useAuth } from '../contexts/AuthContext';
import { Event, Registration } from '../types';
import { registrationsApi, eventsApi } from '../services/api';

const MyEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchMyEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get all user registrations
      const registrationsResponse = await registrationsApi.getByUserId(user?.id || '');
      
      if (registrationsResponse.success) {
        setRegistrations(registrationsResponse.data);
        
        // Fetch details for each event the user is registered for
        const eventPromises = registrationsResponse.data.map(registration => 
          eventsApi.getById(registration.eventId)
        );
        
        const eventResponses = await Promise.all(eventPromises);
        const eventData = eventResponses
          .filter(response => response.success && response.data)
          .map(response => response.data as Event);
        
        setEvents(eventData);
      }
    } catch (error) {
      console.error('Error fetching user registrations:', error);
      setError('Failed to load your events');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    fetchMyEvents();
  }, [isAuthenticated, user, navigate, fetchMyEvents]);
  
  const handleCancelRegistration = async (eventId: string) => {
    if (!isAuthenticated) return;
    
    try {
      const response = await registrationsApi.cancelRegistration(eventId);
      
      if (response.success) {
        // Remove this registration and event from the list
        setRegistrations(prev => prev.filter(reg => reg.eventId !== eventId));
        setEvents(prev => prev.filter(event => event.id !== eventId));
      } else {
        setError(response.message || 'Failed to cancel registration');
      }
    } catch (error) {
      console.error('Error canceling registration:', error);
      setError('An error occurred while canceling your registration');
    }
  };
  
  return (
    <LayoutNoFooter>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section */}
        <div className="bg-white border-2 border-black rounded-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">My Events</h1>
              <p className="text-black text-lg">
                Your upcoming and past event registrations
              </p>
            </div>
            <button 
              onClick={() => navigate('/events')}
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              <Calendar className="h-5 w-5 mr-2" />
              Browse More Events
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-white border-2 border-orange-500 p-4 mb-6 rounded-md shadow-sm">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              <p className="text-black">{error}</p>
            </div>
          </div>
        )}
        
        {/* Tabs for filtering */}
        <div className="border-b border-black mb-6">
          <div className="flex space-x-8">
            <button className="px-4 py-2 border-b-2 border-orange-500 text-black font-medium">
              All Events
            </button>
            <button className="px-4 py-2 border-b-2 border-transparent text-black hover:border-orange-300 transition-colors">
              Upcoming
            </button>
            <button className="px-4 py-2 border-b-2 border-transparent text-black hover:border-orange-300 transition-colors">
              Past Events
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6 animate-pulse border-2 border-black h-64 flex flex-col"
              >
                <div className="h-6 bg-orange-100 rounded w-3/4 mb-4"></div>
                <div className="space-y-3 flex-grow">
                  <div className="h-4 bg-orange-100 rounded w-full"></div>
                  <div className="h-4 bg-orange-100 rounded w-2/3"></div>
                </div>
                <div className="h-8 bg-orange-100 rounded w-1/2 mt-4"></div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => {
              const registration = registrations.find(reg => reg.eventId === event.id);
              const startDate = new Date(event.startDate);
              const endDate = new Date(event.endDate);
              const now = new Date();
              const eventPassed = endDate < now;
              
              return (
                <div 
                  key={event.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col border-2 ${eventPassed ? 'border-black/30' : 'border-black'} h-full`}
                >
                  {/* Event image with overlay */}
                  <div className="relative h-48">
                    <img
                      src={event.imageUrl || '/event-placeholder.jpg'}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start">
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                      {eventPassed && (
                        <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-medium">
                          Past Event
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Event info */}
                  <div className="p-4 flex-grow flex flex-col">
                    <h2 className="text-xl font-semibold mb-2 text-black">
                      {event.title}
                    </h2>
                    
                    <div className="space-y-2 mb-4 text-sm text-black flex-grow">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-orange-500" />
                        <span>{format(startDate, 'MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-orange-500" />
                        <span>
                          {format(startDate, 'h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-orange-500" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      {registration && (
                        <div className="flex items-center mt-2 pt-2 border-t border-black/10">
                          <Ticket className="h-4 w-4 mr-2 text-orange-500" />
                          <span className="text-black text-xs">
                            Registered: {format(new Date(registration.registeredAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 mt-auto">
                      <button
                        className="flex-1 flex justify-center items-center px-3 py-2 border-2 border-black text-black rounded-md hover:bg-black hover:text-white transition-colors text-sm font-medium"
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        View Details
                      </button>
                      
                      {!eventPassed && (
                        <button
                          className="flex justify-center items-center px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
                          onClick={() => handleCancelRegistration(event.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border-2 border-black">
            <div className="bg-orange-50 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-12 w-12 text-orange-500" />
            </div>
            <h2 className="text-2xl font-semibold text-black mb-2">
              No registered events found
            </h2>
            <p className="text-black mb-6 max-w-md mx-auto">
              You haven't registered for any events yet. Discover exciting events and add them to your personal calendar.
            </p>
            <button 
              onClick={() => navigate('/events')}
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium"
            >
              Explore Events
              <ChevronRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    </LayoutNoFooter>
  );
};

export default MyEventsPage;