import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, MapPin, Clock, AlertTriangle } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
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
    <Layout>
      <div className="page-container">
        <h1 className="text-3xl font-bold gradient-text mb-6">My Events</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-md p-6 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-6">
            {events.map(event => {
              const registration = registrations.find(reg => reg.eventId === event.id);
              const startDate = new Date(event.startDate);
              const endDate = new Date(event.endDate);
              const eventPassed = endDate < new Date();
              
              return (
                <div 
                  key={event.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row ${
                    eventPassed ? 'opacity-70' : ''
                  }`}
                >
                  {/* Event image */}
                  <div className="w-full md:w-1/4 h-40 md:h-auto flex-shrink-0">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Event info */}
                  <div className="p-6 flex-grow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold mb-2 md:mb-0">
                        {event.title}
                      </h2>
                      <span className="text-sm bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                        {event.category}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary-500" />
                        <span>{format(startDate, 'MMMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-primary-500" />
                        <span>
                          {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        {registration && (
                          <div className="flex items-center">
                            <span className="text-gray-600 mr-2">
                              Registered on:
                            </span>
                            <span className="font-medium">
                              {format(new Date(registration.registeredAt), 'MMM d, yyyy')}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          View Details
                        </Button>
                        
                        {!eventPassed && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleCancelRegistration(event.id)}
                          >
                            Cancel Registration
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              You haven't registered for any events yet
            </h2>
            <p className="text-gray-600 mb-6">
              Explore our events and register for ones that interest you.
            </p>
            <Button onClick={() => navigate('/events')}>
              Browse Events
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyEventsPage;