import React, { useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Ticket, Plus, RefreshCw, ShoppingBag, Tag, Calendar } from 'lucide-react';
import { useTickets } from '../context/TicketsContext';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { userTickets, userResaleListings, transactions } = useTickets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'tickets' | 'resale' | 'transactions'>('tickets');
  
  // Get user's transactions (as buyer)
  const userTransactions = transactions.filter(t => t.buyerId === user?.id);
  
  if (!user) {
    return null;
  }

  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user.name}
          </p>
          <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
            <span className="text-gray-600 dark:text-gray-400">Balance:</span>
            <span className="ml-2 font-bold text-indigo-600 dark:text-indigo-400">
              {user.balance} Units
            </span>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link 
          to="/sell"
          className="flex items-center justify-center p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span>Sell New Ticket</span>
        </Link>
        <Link 
          to="/"
          className="flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          <span>Browse Tickets</span>
        </Link>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-4 font-medium text-sm border-b-2 ${
              activeTab === 'tickets'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Ticket className="inline-block w-4 h-4 mr-1" />
            My Tickets
          </button>
          <button
            onClick={() => setActiveTab('resale')}
            className={`py-4 font-medium text-sm border-b-2 ${
              activeTab === 'resale'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Tag className="inline-block w-4 h-4 mr-1" />
            Resale Listings
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-4 font-medium text-sm border-b-2 ${
              activeTab === 'transactions'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <RefreshCw className="inline-block w-4 h-4 mr-1" />
            Purchase History
          </button>
        </div>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === 'tickets' && (
        <>
          <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
          
          {userTickets.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Ticket className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No tickets yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't purchased any tickets yet.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Browse Tickets
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40">
                    <img 
                      src={ticket.image} 
                      alt={ticket.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white px-2 py-1 m-2 text-sm rounded-full font-semibold">
                      {ticket.price} Units
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                      {ticket.title}
                    </h3>
                    
                    <div className="mb-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      <time dateTime={ticket.date}>
                        {format(new Date(ticket.date), 'MMM d, yyyy')}
                      </time>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <span className="flex items-center text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 capitalize">
                        <Tag className="w-3 h-3 mr-1" />
                        {ticket.type}
                      </span>
                      
                      <Link 
                        to={`/ticket/${ticket.id}`}
                        className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'resale' && (
        <>
          <h2 className="text-xl font-semibold mb-4">Your Resale Listings</h2>
          
          {userResaleListings.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Tag className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No resale listings</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't listed any tickets for resale.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userResaleListings.map((ticket) => (
                <div 
                  key={ticket.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-40">
                    <img 
                      src={ticket.image} 
                      alt={ticket.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white px-2 py-1 m-2 text-sm rounded-full font-semibold">
                      {ticket.price} Units
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                      {ticket.title}
                    </h3>
                    
                    <div className="mb-3 flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      <time dateTime={ticket.date}>
                        {format(new Date(ticket.date), 'MMM d, yyyy')}
                      </time>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                      <span className="flex items-center text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 capitalize">
                        <Tag className="w-3 h-3 mr-1" />
                        {ticket.type}
                      </span>
                      
                      <Link 
                        to={`/ticket/${ticket.id}`}
                        className="text-indigo-600 dark:text-indigo-400 text-sm hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {activeTab === 'transactions' && (
        <>
          <h2 className="text-xl font-semibold mb-4">Purchase History</h2>
          
          {userTransactions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <RefreshCw className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't made any purchases yet.
              </p>
              <Link 
                to="/"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse Tickets
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Ticket
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Seller
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {userTransactions.map(transaction => {
                      const ticket = userTickets.find(t => t.id === transaction.ticketId);
                      return (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(transaction.timestamp), 'MMM d, yyyy - h:mm a')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link 
                              to={`/ticket/${transaction.ticketId}`}
                              className="text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              {ticket ? ticket.title : 'Unknown Ticket'}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {ticket ? ticket.sellerName : 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">
                            {transaction.price} Units
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;