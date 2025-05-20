import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Users, Share2, Edit, Trash2, AlertTriangle } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import Button from '../components/UI/Button';
import { Event, Registration } from '../types';
import { eventsApi, registrationsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

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
      <Layout>
        <div className="page-container">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-60 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !event) {
    return (
      <Layout>
        <div className="page-container text-center py-12">
          <AlertTriangle className="h-16 w-16 text-error-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Event not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            The event you're looking for may have been removed or doesn't exist.
          </p>
          <Button onClick={() => navigate('/events')}>
            Back to Events
          </Button>
        </div>
      </Layout>
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
    <Layout>
      <div className="page-container">
        {/* Error alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {/* Image banner */}
        <div className="w-full h-64 md:h-80 bg-gray-200 rounded-lg overflow-hidden mb-8 relative">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
          
          {/* Category badge */}
          <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-primary-700">
            {event.category}
          </div>
          
          {/* Admin actions */}
          {canEditEvent && (
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary-500 mr-2" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-primary-500 mr-2" />
                  <span>{formattedTime}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary-500 mr-2" />
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
                className="inline-flex items-center text-primary-600 hover:text-primary-700"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share this event
              </button>
            </div>
          </div>
          
          {/* Registration sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-semibold mb-4">Event Registration</h3>
              
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Available spots</span>
                  <span className="font-semibold">
                    {isEventFull ? 'Sold out' : `${availableSpots} of ${event.capacity}`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Registered attendees</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-primary-500 mr-1" />
                    <span className="font-semibold">{registrationsCount}</span>
                  </div>
                </div>
              </div>
              
              {isAuthenticated ? (
                isRegistered ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                      <p className="text-green-700 font-medium">
                        You're registered for this event!
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={handleCancelRegistration}
                      isLoading={isRegistering}
                    >
                      Cancel Registration
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleRegister}
                    isLoading={isRegistering}
                    disabled={isEventFull}
                  >
                    {isEventFull ? 'Event Full' : 'Register Now'}
                  </Button>
                )
              ) : (
                <div className="space-y-4">
                  <p className="text-center text-gray-600 mb-4">
                    Please log in to register for this event.
                  </p>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/login')}
                  >
                    Log In
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Delete confirmation dialog */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Event
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this event? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventDetailPage;