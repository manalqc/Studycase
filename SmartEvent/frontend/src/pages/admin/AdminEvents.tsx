import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, AlertTriangle } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-black">Manage Events</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/admin/debug')}
              className="flex items-center px-4 py-2 border-2 border-black text-black rounded-md hover:bg-black hover:text-white transition-colors"
            >
              Debug Tools
            </button>
            <button
              onClick={() => navigate('/admin/events/new')}
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-white border-l-4 border-orange-500 p-4 mb-6 rounded-md shadow-sm">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              <p className="text-black">{error}</p>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-black">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center border-t border-black p-4">
                <div className="h-12 w-12 rounded-md bg-orange-100 mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-orange-100 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-orange-100 rounded w-1/2"></div>
                </div>
                <div className="h-8 w-24 bg-orange-100 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-black">
            <table className="min-w-full divide-y divide-black">
              <thead className="bg-black">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Event
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Registrations
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map(event => {
                  const eventRegistrations = registrations[event.id] || [];
                  const registrationCount = eventRegistrations.length;
                  const startDate = new Date(event.startDate);
                  
                  return (
                    <tr key={event.id} className="hover:bg-orange-50 transition-colors">
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
                              <div className="text-sm text-black font-medium">{event.title}</div>
                              <div className="text-sm text-black truncate max-w-xs">
                                {event.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-black font-medium">
                          {format(startDate, 'MMMM d, yyyy')}
                        </div>
                        <div className="text-sm text-black">
                          {format(startDate, 'h:mm a')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-orange-500 mr-1" />
                          <span className="text-sm text-black">
                            {registrationCount} / {event.capacity}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-black">
                          {event.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/events/${event.id}`)}
                            className="px-3 py-1 text-xs border border-black text-black rounded hover:bg-black hover:text-white transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                            className="px-3 py-1 text-xs border border-black text-black rounded hover:bg-black hover:text-white transition-colors flex items-center"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteId(event.id)}
                            className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors flex items-center"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-black">
            <h2 className="text-2xl font-semibold text-black mb-2">
              No events found
            </h2>
            <p className="text-black mb-6">
              Create your first event to get started.
            </p>
            <button 
              onClick={() => navigate('/admin/events/new')}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Create Event
            </button>
          </div>
        )}
        
        {/* Delete confirmation modal */}
        {deleteId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full animate-fade-in border-2 border-black">
              <h3 className="text-lg font-bold text-black mb-2">
                Confirm Deletion
              </h3>
              <p className="text-black mb-4">
                Are you sure you want to delete this event? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-black text-black rounded-md hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEvent}
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
    </Layout>
  );
};

export default AdminEvents;