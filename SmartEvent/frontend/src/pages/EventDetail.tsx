import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Users, Share2, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import LayoutNoFooter from '../components/Layout/LayoutNoFooter';
import { useAuth } from '../contexts/AuthContext';
import { Event, Registration } from '../types';
import { eventsApi, registrationsApi } from '../services/api';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const eventResponse = await eventsApi.getById(id);
        if (eventResponse.success && eventResponse.data) {
          setEvent(eventResponse.data);
          
          // Fetch registrations for this event
          const registrationsResponse = await registrationsApi.getByEventId(id);
          if (registrationsResponse.success) {
            setRegistrations(registrationsResponse.data);
            
            // Check if current user is registered
            if (isAuthenticated && user) {
              const userRegistration = registrationsResponse.data.find(
                reg => reg.userId === user.id
              );
              setIsRegistered(!!userRegistration);
            }
          }
        } else {
          setError('Event not found');
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Failed to load event details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEventData();
  }, [id, isAuthenticated, user]);
  
  const handleRegister = async () => {
    if (!event || !isAuthenticated) return;
    
    setIsRegistering(true);
    setError(null);
    
    try {
      const response = await registrationsApi.register(event.id);
      
      if (response.success) {
        setIsRegistered(true);
        setRegistrations(prev => [...prev, response.data]);
      } else {
        setError(response.message || 'Failed to register for the event');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsRegistering(false);
    }
  };
  
  const handleCancelRegistration = async () => {
    if (!event || !isAuthenticated) return;
    
    setIsRegistering(true);
    setError(null);
    
    try {
      const response = await registrationsApi.cancelRegistration(event.id);
      
      if (response.success) {
        setIsRegistered(false);
        // Remove user's registration from the list
        if (user) {
          setRegistrations(prev => 
            prev.filter(reg => reg.userId !== user.id)
          );
        }
      } else {
        setError(response.message || 'Failed to cancel registration');
      }
    } catch (error) {
      console.error('Error canceling registration:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsRegistering(false);
    }
  };
  
  const handleDelete = async () => {
    if (!event) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      const response = await eventsApi.delete(event.id);
      
      if (response.success) {
        navigate('/events');
      } else {
        setError(response.message || 'Failed to delete the event');
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('An unexpected error occurred');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };
  
  if (isLoading) {
    return (
      <LayoutNoFooter>
        <div className="page-container">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-60 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </LayoutNoFooter>
    );
  }
  
  if (error || !event) {
    return (
      <LayoutNoFooter>
        <div className="page-container text-center py-12">
          <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-black mb-2">
            {error || 'Event not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            The event you're looking for may have been removed or doesn't exist.
          </p>
          <button 
            onClick={() => navigate('/events')}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </LayoutNoFooter>
    );
  }
  
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const isSameDay = startDate.toDateString() === endDate.toDateString();
  
  const formattedDate = isSameDay
    ? format(startDate, 'EEEE, MMMM d, yyyy')
    : `${format(startDate, 'MMMM d')} - ${format(endDate, 'MMMM d, yyyy')}`;
  
  const formattedTime = isSameDay
    ? `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`
    : `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;
  
  const isEventCreator = user && event.createdBy === user.id;
  const canEditEvent = isAdmin || isEventCreator;
  const registrationsCount = registrations.length;
  const availableSpots = event.capacity - registrationsCount;
  const isEventFull = availableSpots <= 0;
  
  return (
    <LayoutNoFooter>
      <div className="page-container">
        {/* Error alert */}
        {error && (
          <div className="bg-white border-l-4 border-orange-500 p-4 mb-6 rounded-md shadow-sm">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              <p className="text-black">{error}</p>
            </div>
          </div>
        )}
        
        {/* Image banner */}
        <div className="relative h-96 rounded-xl overflow-hidden bg-white border-2 border-black">
          <img
            src={event.imageUrl || '/event-placeholder.jpg'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-orange-500 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-white">
              {event.category}
            </span>
          </div>
          
          {/* Admin actions */}
          {canEditEvent && (
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button
                onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                className="flex items-center px-3 py-1 border-2 border-black text-black rounded-md hover:bg-black hover:text-white transition-colors text-sm font-medium"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-black">{event.title}</h1>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center text-black">
                  <Calendar className="h-5 w-5 text-orange-500 mr-2" />
                  <span>
                    {format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center text-black">
                  <Clock className="h-5 w-5 text-orange-500 mr-2" />
                  <span>
                    {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
                  </span>
                </div>
                <div className="flex items-center text-black">
                  <MapPin className="h-5 w-5 text-orange-500 mr-2" />
                  <span>{event.location}</span>
                </div>
              </div>
            
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
              </div>
            </div>
            
            {/* Share button */}
            <div className="pt-4">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="flex items-center text-orange-500 hover:text-orange-600 font-medium"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share this event
              </button>
            </div>
          </div>
          
          {/* Registration sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6 border-2 border-black">
              <h3 className="text-xl font-semibold mb-4 text-black">Event Registration</h3>
              
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-black">
                  <span className="text-black">Available spots</span>
                  <span className="font-semibold text-black">
                    {isEventFull ? 'Sold out' : `${availableSpots} of ${event.capacity}`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b border-black">
                  <span className="text-black">Registered attendees</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="font-semibold text-black">{registrationsCount}</span>
                  </div>
                </div>
              </div>
              
              {isAuthenticated ? (
                isRegistered ? (
                  <div className="space-y-4">
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-md">
                      <p className="text-black font-medium">
                        You're registered for this event!
                      </p>
                    </div>
                    <button
                      onClick={handleCancelRegistration}
                      disabled={isRegistering}
                      className="w-full flex justify-center py-2 px-4 border-2 border-black rounded-md shadow-sm text-sm font-medium text-black bg-white hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                    >
                      {isRegistering ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : 'Cancel Registration'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={isEventFull || isRegistering}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
                  >
                    {isRegistering ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Registering...
                      </>
                    ) : (isEventFull ? 'Event Full' : 'Register Now')}
                  </button>
                )
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-black mb-4">
                    Please log in to register for this event.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                  >
                    Log In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Delete confirmation dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in border-2 border-black">
              <h3 className="text-xl font-bold text-black mb-2">
                Delete Event
              </h3>
              <p className="text-black mb-6">
                Are you sure you want to delete this event? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-black text-black rounded-md hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutNoFooter>
  );
};

export default EventDetailPage;