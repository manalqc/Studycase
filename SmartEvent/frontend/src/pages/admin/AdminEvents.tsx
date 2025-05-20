import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, AlertTriangle } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import Button from '../../components/UI/Button';
import { Event, Registration } from '../../types';
import { eventsApi, registrationsApi } from '../../services/api';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

const AdminEvents: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Record<string, Registration[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await eventsApi.getAll();
        
        if (response.success) {
          setEvents(response.data);
          
          // Fetch registrations for each event
          const registrationPromises = response.data.map(event => 
            registrationsApi.getByEventId(event.id)
          );
          
          const registrationResponses = await Promise.all(registrationPromises);
          
          const registrationMap: Record<string, Registration[]> = {};
          
          registrationResponses.forEach((response, index) => {
            if (response.success) {
              registrationMap[response.data[0]?.eventId || response.data[0]?.id || index] = response.data;
            }
          });
          
          setRegistrations(registrationMap);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Error loading events');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, [isAdmin, navigate]);
  
  const handleDeleteEvent = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    
    try {
      const response = await eventsApi.delete(deleteId);
      
      if (response.success) {
        setEvents(events.filter(event => event.id !== deleteId));
        setDeleteId(null);
      } else {
        setError(response.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Layout>
      <div className="page-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold gradient-text">Manage Events</h1>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/debug')}
              className="flex items-center"
            >
              Debug Tools
            </Button>
            <Button
              onClick={() => navigate('/admin/events/new')}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="animate-pulse">
              <div className="h-16 bg-gray-200"></div>
              {[...Array(5)].map((_, index) => (
                <div key={index} className="border-t border-gray-200 p-4">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        ) : events.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registrations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map(event => {
                  const eventRegistrations = registrations[event.id] || [];
                  const registrationCount = eventRegistrations.length;
                  const startDate = new Date(event.startDate);
                  
                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden">
                            <img
                              src={event.imageUrl}
                              alt=""
                              className="h-10 w-10 object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {event.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {event.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(startDate, 'MMM d, yyyy')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(startDate, 'h:mm a')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-primary-500 mr-1" />
                          <span className="text-sm text-gray-900">
                            {registrationCount} / {event.capacity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                          {event.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/events/${event.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                            className="flex items-center"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setDeleteId(event.id)}
                            className="flex items-center"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No events found
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first event to get started.
            </p>
            <Button onClick={() => navigate('/admin/events/new')}>
              Create Event
            </Button>
          </div>
        )}
        
        {/* Delete confirmation modal */}
        {deleteId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full animate-fade-in">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this event? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setDeleteId(null)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDeleteEvent}
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

export default AdminEvents;