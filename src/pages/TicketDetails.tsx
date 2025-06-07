import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, MapPin, Tag, ArrowLeft, AlertCircle, ShieldCheck, Check, Download } from 'lucide-react';
import { useTickets } from '../context/TicketsContext';
import { useAuth } from '../context/AuthContext';

const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getTicketById, getCurrentOwner, purchaseTicket } = useTickets();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [error, setError] = useState('');
  
  if (!id) {
    return <div>Invalid ticket ID</div>;
  }
  
  const ticket = getTicketById(id);
  
  if (!ticket) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Ticket Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Sorry, we couldn't find the ticket you're looking for.
        </p>
        <Link
          to="/"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
      </div>
    );
  }
  
  const currentOwnerId = getCurrentOwner(id);
  const isOwner = user && user.id === currentOwnerId;
  const formattedDate = format(new Date(ticket.date), 'EEEE, MMMM d, yyyy - h:mm a');

  const handleDownload = () => {
    // Create ticket data
    const ticketData = {
      title: ticket.title,
      date: formattedDate,
      location: ticket.location,
      type: ticket.type,
      owner: user?.name,
      id: ticket.id,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket.id}`
    };

    // Create a blob with ticket data
    const blob = new Blob([JSON.stringify(ticketData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${ticket.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  
  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isOwner) {
      setError("You already own this ticket");
      return;
    }
    
    setIsPurchasing(true);
    setError('');
    
    try {
      const success = await purchaseTicket(id);
      
      if (success) {
        setPurchaseSuccess(true);
      } else {
        if (user && user.balance < ticket.price) {
          setError("You don't have enough balance to purchase this ticket");
        } else {
          setError("Failed to purchase ticket. Please try again.");
        }
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during purchase");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to All Tickets
        </Link>
      </div>
      
      {purchaseSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg flex items-start">
          <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium">Purchase Successful!</h3>
            <p className="mt-1">
              You are now the owner of this ticket. You can view it in your 
              <Link to="/dashboard" className="ml-1 underline">dashboard</Link>.
            </p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="md:flex">
          {/* Ticket Image */}
          <div className="md:w-1/2 h-64 md:h-auto relative">
            <img 
              src={ticket.image} 
              alt={ticket.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                <Tag className="w-4 h-4 mr-1" />
                <span className="capitalize">{ticket.type}</span>
              </span>
            </div>
          </div>
          
          {/* Ticket Information */}
          <div className="md:w-1/2 p-6 md:p-8">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {ticket.title}
              </h1>
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-lg font-bold">
                {ticket.price} Units
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <Calendar className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <MapPin className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
                <span>{ticket.location}</span>
              </div>
            </div>
            
            <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400">{ticket.description}</p>
            </div>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-2 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Secure ownership transfer
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Seller: {ticket.sellerName}
                </span>
              </div>
              
              {isOwner ? (
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg text-center">
                    <p className="font-medium">You own this ticket</p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Ticket
                  </button>
                  <Link
                    to="/sell"
                    className="w-full flex items-center justify-center py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Resell This Ticket
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={isPurchasing || purchaseSuccess}
                  className={`w-full py-3 rounded-lg text-white font-medium ${
                    isPurchasing || purchaseSuccess
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700'
                  } transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                >
                  {isPurchasing ? 'Processing...' : purchaseSuccess ? 'Purchased' : 'Buy Ticket'}
                </button>
              )}
              
              {!isAuthenticated && (
                <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                  <Link 
                    to="/login" 
                    className="text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Sign in
                  </Link> to purchase this ticket
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;