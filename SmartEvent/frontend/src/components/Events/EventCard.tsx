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
    <div className="card group h-full flex flex-col">
      <div className="relative overflow-hidden rounded-t-lg" style={{ aspectRatio: '16/9' }}>
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent opacity-70" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-primary-700">
          {event.category}
        </div>
      </div>
      
      <div className="flex-1 p-5">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{event.title}</h3>
        
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-start">
            <Calendar className="w-4 h-4 mt-0.5 mr-2 text-primary-500 flex-shrink-0" />
            <span>{dateDisplay}</span>
          </div>
          
          <div className="flex items-start">
            <MapPin className="w-4 h-4 mt-0.5 mr-2 text-primary-500 flex-shrink-0" />
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-start">
            <Users className="w-4 h-4 mt-0.5 mr-2 text-primary-500 flex-shrink-0" />
            <span>{event.capacity} attendees max</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{event.description}</p>
      </div>
      
      <div className="p-5 pt-0 mt-auto">
        <Link
          to={`/events/${event.id}`}
          className="btn-primary w-full text-center justify-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;