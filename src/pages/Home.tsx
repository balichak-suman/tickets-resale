import React, { useState } from 'react';
import { useTickets, TicketType } from '../context/TicketsContext';
import TicketCard from '../components/TicketCard';
import TicketFilter from '../components/TicketFilter';
import { Ticket, Users } from 'lucide-react';

const Home: React.FC = () => {
  const [filteredTickets, setFilteredTickets] = useState<ReturnType<typeof useTickets>['tickets']>([]);
  const [hasFiltered, setHasFiltered] = useState(false);
  const { tickets } = useTickets();

  // Separate new tickets and resale tickets
  const newTickets = tickets.filter(ticket => !ticket.isResale && ticket.available);
  const resaleTickets = tickets.filter(ticket => ticket.isResale && ticket.available);

  const handleFilter = (
    type: TicketType | undefined, 
    query: string, 
    minPrice?: number, 
    maxPrice?: number
  ) => {
    const filtered = tickets.filter(ticket => {
      // Filter by type
      if (type && ticket.type !== type) return false;
      
      // Filter by search query
      if (query) {
        const searchLower = query.toLowerCase();
        const matchesTitle = ticket.title.toLowerCase().includes(searchLower);
        const matchesDescription = ticket.description.toLowerCase().includes(searchLower);
        const matchesLocation = ticket.location.toLowerCase().includes(searchLower);
        
        if (!matchesTitle && !matchesDescription && !matchesLocation) return false;
      }
      
      // Filter by price range
      if (minPrice !== undefined && ticket.price < minPrice) return false;
      if (maxPrice !== undefined && ticket.price > maxPrice) return false;
      
      // Only show available tickets
      return ticket.available;
    });
    
    setFilteredTickets(filtered);
    setHasFiltered(true);
  };

  const displayTickets = hasFiltered ? filteredTickets : tickets.filter(t => t.available);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative mb-12 -mt-8 py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white overflow-hidden">
        <div className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Find Your Next Ticket</h1>
            <p className="text-lg mb-8 text-indigo-100">
              Buy and sell tickets for concerts, events, movies, and transportation safely and securely.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#browse" 
                className="w-full sm:w-auto px-6 py-3 bg-white text-indigo-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Browse Tickets
              </a>
              <a 
                href="/sell" 
                className="w-full sm:w-auto px-6 py-3 bg-indigo-800 text-white font-medium rounded-lg hover:bg-indigo-900 transition-colors"
              >
                Sell Your Tickets
              </a>
            </div>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-purple-800 transform translate-x-1/3 translate-y-1/3"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full mr-4">
                <Ticket className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold">Secure Transactions</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Buy and sell tickets with confidence using our secure virtual currency system.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mr-4">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Verified Tickets</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              All tickets are verified and ownership is securely tracked in our system.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <div className="bg-pink-100 dark:bg-pink-900 p-3 rounded-full mr-4">
                <Users className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-semibold">User Community</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Join thousands of users buying and selling tickets every day.
            </p>
          </div>
        </div>
      </section>

      {/* Tickets Section */}
      <section id="browse" className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Available Tickets</h2>
        
        <TicketFilter onFilter={handleFilter} />

        {hasFiltered ? (
          displayTickets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 dark:text-gray-400">No tickets found matching your criteria.</p>
              <button
                onClick={() => {
                  setHasFiltered(false);
                  setFilteredTickets([]);
                }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Show All Tickets
              </button>
            </div>
          )
        ) : (
          <>
            {/* New Tickets */}
            {newTickets.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xl font-semibold mb-4">New Tickets</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              </div>
            )}

            {/* Resale Tickets */}
            {resaleTickets.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Resale Tickets</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resaleTickets.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              </div>
            )}

            {newTickets.length === 0 && resaleTickets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500 dark:text-gray-400">No tickets available at the moment.</p>
              </div>
            )}
          </>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-white p-8 mb-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Have Tickets to Sell?</h2>
          <p className="mb-6">List your unused tickets and earn virtual currency that you can use to buy other tickets.</p>
          <a 
            href="/sell" 
            className="inline-block px-6 py-3 bg-white text-indigo-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Selling Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;