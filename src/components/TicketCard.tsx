import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { Ticket } from '../context/TicketsContext';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const { id, title, price, date, location, type, image } = ticket;
  
  const formattedDate = new Date(date);
  const timeFromNow = formatDistanceToNow(formattedDate, { addSuffix: true });

  return (
    <Link
      to={`/ticket/${id}`}
      className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 m-2 rounded-full text-sm font-semibold">
          {price} Units
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent opacity-70 h-16"></div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
          {title}
        </h3>
        
        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          <time dateTime={date}>{timeFromNow}</time>
        </div>
        
        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{location}</span>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-1" />
            <span className="text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5 capitalize">
              {type}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Click to view details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TicketCard;