import React, { useState } from 'react';
import { format } from 'date-fns';
import { useTickets } from '../context/TicketsContext';
import { Search, FileText, User, Clock, ArrowDown, ArrowUp, Info } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { tickets, transactions, ownerships } = useTickets();
  const [activeTab, setActiveTab] = useState<'transactions' | 'ownership'>('transactions');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    const ticket = tickets.find(t => t.id === transaction.ticketId);
    
    return (
      transaction.ticketId.toLowerCase().includes(query) ||
      transaction.sellerId.toLowerCase().includes(query) ||
      transaction.buyerId.toLowerCase().includes(query) ||
      (ticket && ticket.title.toLowerCase().includes(query))
    );
  });
  
  // Filter ownerships based on search query
  const filteredOwnerships = ownerships.filter(record => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    const ticket = tickets.find(t => t.id === record.ticketId);
    
    return (
      record.ticketId.toLowerCase().includes(query) ||
      record.ownerId.toLowerCase().includes(query) ||
      (ticket && ticket.title.toLowerCase().includes(query))
    );
  });
  
  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortField) return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'date':
        return direction * (new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      case 'price':
        return direction * (a.price - b.price);
      default:
        return 0;
    }
  });
  
  // Sort ownerships
  const sortedOwnerships = [...filteredOwnerships].sort((a, b) => {
    if (!sortField) return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'date':
        return direction * (new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      default:
        return 0;
    }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Manage tickets, transactions, and user data
      </p>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab === 'transactions' ? 'transactions' : 'ownerships'}...`}
            className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'transactions'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <FileText className="inline-block w-4 h-4 mr-1" />
            Transaction Log
          </button>
          <button
            onClick={() => setActiveTab('ownership')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'ownership'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <User className="inline-block w-4 h-4 mr-1" />
            Ticket Ownership
          </button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Tickets</p>
              <h3 className="text-2xl font-bold">{tickets.length}</h3>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Transactions</p>
              <h3 className="text-2xl font-bold">{transactions.length}</h3>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <svg 
                className="h-6 w-6 text-green-600 dark:text-green-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Volume</p>
              <h3 className="text-2xl font-bold">
                {transactions.reduce((sum, t) => sum + t.price, 0)} Units
              </h3>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <svg 
                className="h-6 w-6 text-purple-600 dark:text-purple-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Ownership Records</p>
              <h3 className="text-2xl font-bold">{ownerships.length}</h3>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full">
              <User className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === 'transactions' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {sortedTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Date/Time
                        {sortField === 'date' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Seller ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Buyer ID
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center">
                        Price
                        {sortField === 'price' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedTransactions.map((transaction) => {
                    const ticket = tickets.find(t => t.id === transaction.ticketId);
                    return (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(transaction.timestamp), 'MMM d, yyyy - h:mm a')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {ticket ? (
                              <>
                                <div className="h-8 w-8 flex-shrink-0 rounded overflow-hidden">
                                  <img 
                                    src={ticket.image} 
                                    alt={ticket.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{ticket.title}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">ID: {ticket.id.substring(0, 8)}</p>
                                </div>
                              </>
                            ) : (
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Unknown Ticket ({transaction.ticketId.substring(0, 8)})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {transaction.sellerId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {transaction.buyerId}
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
          ) : (
            <div className="p-8 text-center">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No transactions found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Try a different search query' : 'Transactions will appear here once tickets are bought or sold'}
              </p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'ownership' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          {sortedOwnerships.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Date/Time
                        {sortField === 'date' && (
                          sortDirection === 'asc' ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Owner ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedOwnerships.map((record) => {
                    const ticket = tickets.find(t => t.id === record.ticketId);
                    
                    // Determine if this is the current ownership record
                    const isCurrentOwner = record.timestamp === [...ownerships]
                      .filter(o => o.ticketId === record.ticketId)
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]?.timestamp;
                    
                    return (
                      <tr key={`${record.ticketId}-${record.timestamp}`} className={!isCurrentOwner ? 'opacity-60' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {format(new Date(record.timestamp), 'MMM d, yyyy - h:mm a')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {ticket ? (
                              <>
                                <div className="h-8 w-8 flex-shrink-0 rounded overflow-hidden">
                                  <img 
                                    src={ticket.image} 
                                    alt={ticket.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{ticket.title}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">ID: {ticket.id.substring(0, 8)}</p>
                                </div>
                              </>
                            ) : (
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                Unknown Ticket ({record.ticketId.substring(0, 8)})
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {record.ownerId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isCurrentOwner ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Current Owner
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400">
                              Previous Owner
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">No ownership records found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery ? 'Try a different search query' : 'Ownership records will appear here once tickets are created or sold'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;