import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5293/api';

const EventCreationTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const createTestEvent = async () => {
    setLoading(true);
    setResult('');
    
    try {
      // Get the token
      const token = localStorage.getItem('token');
      if (!token) {
        setResult('No authentication token found. Please login first.');
        setLoading(false);
        return;
      }
      
      // Create a minimal event object with only the required fields
      const testEvent = {
        title: 'Test Event ' + new Date().toISOString(),
        description: 'This is a test event created for debugging',
        location: 'Test Location',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
        capacity: 10,
        imageUrl: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg',
        category: 'Conference'
      };
      
      console.log('Sending test event:', testEvent);
      
      // Make the API call directly
      const response = await axios.post(
        `${API_URL}/events`, 
        testEvent,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('API response:', response.data);
      setResult('Success! Event created with ID: ' + response.data.data.id);
    } catch (error: any) {
      console.error('Error creating test event:', error);
      setResult(`Error: ${error.response?.status} ${error.response?.statusText}\n${JSON.stringify(error.response?.data || {}, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Event Creation Debug Tool</h2>
      <button 
        onClick={createTestEvent}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Test Event'}
      </button>
      
      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default EventCreationTest;
