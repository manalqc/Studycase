import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import EventForm from '../../components/Events/EventForm';
import Button from '../../components/UI/Button';
import { Event } from '../../types';
import { eventsApi } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const EventEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(id ? true : false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!id;
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    if (id) {
      const fetchEvent = async () => {
        setIsLoading(true);
        
        try {
          const response = await eventsApi.getById(id);
          
          if (response.success && response.data) {
            setEvent(response.data);
          } else {
            setError('Event not found');
          }
        } catch (error) {
          console.error('Error fetching event:', error);
          setError('Failed to load event');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchEvent();
    }
  }, [id, isAdmin, navigate]);
  
  const handleSubmit = async (eventData: Partial<Event>) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Form data being submitted:', eventData);
      let response;
      
      // Format the dates properly for the backend (ISO format)
      const formatDateForBackend = (dateString: string | undefined) => {
        if (!dateString) return new Date().toISOString();
        // Ensure the date is in ISO format for the backend
        return new Date(dateString).toISOString();
      };
      
      // Parse capacity as a number to ensure it's sent as a number, not a string
      const capacityValue = typeof eventData.capacity === 'string' 
        ? parseInt(eventData.capacity, 10) 
        : (eventData.capacity || 0);

      if (isEditMode && id) {
        // For updates, ensure dates are properly formatted
        const updatedEvent = {
          ...eventData,
          startDate: formatDateForBackend(eventData.startDate),
          endDate: formatDateForBackend(eventData.endDate),
          capacity: capacityValue
        };
        response = await eventsApi.update(id, updatedEvent);
      } else {
        // Make sure all required fields are present and properly formatted
        // and match the exact structure expected by the backend
        const newEvent = {
          title: eventData.title || '',
          description: eventData.description || '',
          location: eventData.location || '',
          startDate: formatDateForBackend(eventData.startDate),
          endDate: formatDateForBackend(eventData.endDate),
          capacity: capacityValue,
          imageUrl: eventData.imageUrl || '',
          category: eventData.category || 'Conference',
          // These will be set by the backend but including empty values to match model
          id: '',  // Will be generated by backend
          createdBy: '', // Will be set from token
          createdAt: new Date().toISOString() // Will be set by backend
        };
        
        console.log('Creating new event with:', newEvent);
        // Send the complete event object to match the backend model
        response = await eventsApi.create(newEvent);
      }
      
      console.log('API response:', response);
      
      if (response.success) {
        console.log('Event saved successfully:', response.data);
        navigate('/admin');
      } else {
        console.error('Failed to save event:', response.message);
        setError(response.message || 'Failed to save event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="page-container">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold gradient-text">
            {isEditMode ? 'Edit Event' : 'Create Event'}
          </h1>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ) : (
            <EventForm
              initialData={event || {}}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EventEditor;