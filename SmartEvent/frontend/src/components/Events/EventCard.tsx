import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users } from 'lucide-react';
import { Event } from '../../types';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  
  // Format the date display based on if it's a single-day or multi-day event
  const isSameDay = startDate.toDateString() === endDate.toDateString();
  
  const dateDisplay = isSameDay
    ? `${format(startDate, 'MMM d, yyyy')} · ${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`
    : `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  
  return (
    <div className="bg-white border border-black rounded-lg shadow-sm h-full flex flex-col group">
      <div className="relative overflow-hidden rounded-t-lg" style={{ aspectRatio: '16/9' }}>
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent opacity-50" />
        <div className="absolute top-3 right-3 bg-orange-500 px-2 py-1 rounded-full text-xs font-medium text-white">
          {event.category}
        </div>
      </div>
      
      <div className="flex-1 p-5">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{event.title}</h3>
        
        <div className="space-y-2 mb-4 text-sm text-black">
          <div className="flex items-start">
            <Calendar className="w-4 h-4 mt-0.5 mr-2 text-orange-500 flex-shrink-0" />
            <span>{dateDisplay}</span>
          </div>
          
          <div className="flex items-start">
            <MapPin className="w-4 h-4 mt-0.5 mr-2 text-orange-500 flex-shrink-0" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-start">
            <Users className="w-4 h-4 mt-0.5 mr-2 text-orange-500 flex-shrink-0" />
            <span>{event.capacity} attendees max</span>
          </div>
        </div>
        
        <p className="text-black mb-4 line-clamp-2 text-sm">{event.description}</p>
      </div>
      
      <div className="p-5 pt-0 mt-auto">
        <Link
          to={`/events/${event.id}`}
          className="bg-orange-500 text-white py-2 px-4 rounded-md w-full text-center justify-center hover:bg-orange-600 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;