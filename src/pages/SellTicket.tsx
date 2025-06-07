import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, ArrowLeft, AlertCircle, Check, Ticket as TicketIcon } from 'lucide-react';
import { useTickets, TicketType } from '../context/TicketsContext';
import { useAuth } from '../context/AuthContext';

// Sample ticket images from Pexels
const sampleTicketImages = [
  'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg',
  'https://images.pexels.com/photos/953457/pexels-photo-953457.jpeg',
  'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
  'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
  'https://images.pexels.com/photos/7234262/pexels-photo-7234262.jpeg',
  'https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg'
];

const SellTicket: React.FC = () => {
  const [isNewTicket, setIsNewTicket] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<TicketType>('event');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { addTicket, userTickets } = useTickets();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleExistingTicketSelect = (ticketId: string) => {
    const ticket = userTickets.find(t => t.id === ticketId);
    if (ticket) {
      setSelectedTicket(ticketId);
      setTitle(ticket.title);
      setDescription(ticket.description);
      setPrice(ticket.price.toString());
      setDate(new Date(ticket.date).toISOString().split('T')[0]);
      setTime(new Date(ticket.date).toISOString().split('T')[1].substring(0, 5));
      setLocation(ticket.location);
      setType(ticket.type);
      // Find matching sample image or use first one
      const imageIndex = sampleTicketImages.indexOf(ticket.image);
      setSelectedImageIndex(imageIndex >= 0 ? imageIndex : 0);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isNewTicket && !selectedTicket) {
      setError('Please select a ticket to resell');
      return;
    }
    
    if (!title || !description || !price || !date || !time || !location) {
      setError('Please fill in all fields');
      return;
    }
    
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price');
      return;
    }
    
    const dateTime = `${date}T${time}`;
    
    setIsSubmitting(true);
    
    try {
      const ticketId = addTicket({
        title,
        description,
        price: priceNum,
        date: dateTime,
        location,
        type,
        image: sampleTicketImages[selectedImageIndex],
      }, !isNewTicket ? selectedTicket : undefined); // Pass existing ticket ID when reselling
      
      setSuccess(true);
      
      setTimeout(() => {
        navigate(`/ticket/${ticketId}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Filter out tickets that are already being resold
  const availableTicketsForResale = userTickets.filter(ticket => !ticket.isResale);
  
  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      </div>
      
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:shrink-0 md:w-1/3 bg-indigo-600 p-6 text-white">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-4">Sell Your Ticket</h2>
                <p className="mb-6">
                  List your unused tickets and earn virtual currency that you can use to buy other tickets.
                </p>
                <div className="space-y-4 text-indigo-100">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 mr-2 mt-0.5 text-indigo-300" />
                    <p>Secure ownership transfer</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 mr-2 mt-0.5 text-indigo-300" />
                    <p>Automatic delivery to buyers</p>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 mr-2 mt-0.5 text-indigo-300" />
                    <p>Transparent transaction records</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-8 md:w-2/3">
            <div className="mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setIsNewTicket(true);
                    setSelectedTicket(null);
                    setTitle('');
                    setDescription('');
                    setPrice('');
                    setDate('');
                    setTime('');
                    setLocation('');
                    setType('event');
                  }}
                  className={`px-4 py-2 rounded-lg ${
                    isNewTicket
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  New Ticket
                </button>
                <button
                  onClick={() => setIsNewTicket(false)}
                  className={`px-4 py-2 rounded-lg ${
                    !isNewTicket
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Resell Existing Ticket
                </button>
              </div>
            </div>

            {!isNewTicket && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Select a ticket to resell</h3>
                <div className="space-y-3">
                  {availableTicketsForResale.length > 0 ? (
                    availableTicketsForResale.map(ticket => (
                      <div
                        key={ticket.id}
                        onClick={() => handleExistingTicketSelect(ticket.id)}
                        className={`p-4 rounded-lg border cursor-pointer ${
                          selectedTicket === ticket.id
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded overflow-hidden mr-4">
                            <img
                              src={ticket.image}
                              alt={ticket.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{ticket.title}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(ticket.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <TicketIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        You don't have any tickets available for resale
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <h2 className="text-xl font-semibold mb-6">Ticket Information</h2>
            
            {success && (
              <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-center">
                <Check className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>Ticket created successfully! Redirecting to ticket page...</p>
              </div>
            )}
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ticket Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Concert Ticket for Taylor Swift"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Provide details about the ticket..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price (Units)
                    </label>
                    <input
                      id="price"
                      type="number"
                      min="1"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., 50"
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ticket Type
                    </label>
                    <select
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value as TicketType)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="event">Event</option>
                      <option value="concert">Concert</option>
                      <option value="movie">Movie</option>
                      <option value="train">Train</option>
                      <option value="bus">Bus</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Time
                    </label>
                    <input
                      id="time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Madison Square Garden, New York"
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Choose an Image
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {sampleTicketImages.map((img, index) => (
                      <div 
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative cursor-pointer rounded-md overflow-hidden h-24 ${
                          selectedImageIndex === index 
                            ? 'ring-2 ring-indigo-600 dark:ring-indigo-400' 
                            : 'hover:opacity-75'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Sample ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        {selectedImageIndex === index && (
                          <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Select one of the sample images above.
                  </p>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || success}
                    className={`w-full py-3 rounded-lg text-white font-medium ${
                      isSubmitting || success
                        ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700'
                    } transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    {isSubmitting ? 'Creating...' : success ? 'Created Successfully' : 'List Ticket for Sale'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellTicket;