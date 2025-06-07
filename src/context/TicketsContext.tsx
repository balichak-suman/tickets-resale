import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { useAuth } from './AuthContext';

// Define ticket types
export type TicketType = 'event' | 'concert' | 'movie' | 'train' | 'bus';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  price: number;
  date: string;
  location: string;
  type: TicketType;
  image: string;
  sellerId: string;
  sellerName: string;
  available: boolean;
  isResale?: boolean;
  originalTicketId?: string;
}

export interface Transaction {
  id: string;
  ticketId: string;
  sellerId: string;
  buyerId: string;
  price: number;
  timestamp: string;
}

export interface OwnershipRecord {
  ticketId: string;
  ownerId: string;
  timestamp: string;
}

interface TicketsContextType {
  tickets: Ticket[];
  transactions: Transaction[];
  ownerships: OwnershipRecord[];
  userTickets: Ticket[];
  userResaleListings: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'sellerId' | 'sellerName' | 'available'>, existingTicketId?: string) => string;
  purchaseTicket: (ticketId: string) => Promise<boolean>;
  getTicketById: (id: string) => Ticket | undefined;
  getCurrentOwner: (ticketId: string) => string;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

// Sample ticket images from Pexels
const sampleTicketImages = [
  'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg',
  'https://images.pexels.com/photos/953457/pexels-photo-953457.jpeg',
  'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
  'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
  'https://images.pexels.com/photos/7234262/pexels-photo-7234262.jpeg',
  'https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg'
];

// Get stored data from localStorage or use defaults
const getStoredData = () => {
  const storedTickets = localStorage.getItem('tickets');
  const storedTransactions = localStorage.getItem('transactions');
  const storedOwnerships = localStorage.getItem('ownerships');

  const defaultTickets = [
    {
      id: '1',
      title: 'Summer Music Festival',
      description: 'Annual music festival featuring top artists from around the world.',
      price: 150,
      date: '2025-07-15T18:00:00',
      location: 'Central Park, New York',
      type: 'concert' as TicketType,
      image: sampleTicketImages[0],
      sellerId: '2',
      sellerName: 'Regular User',
      available: true,
    },
  ];

  return {
    tickets: storedTickets ? JSON.parse(storedTickets) : defaultTickets,
    transactions: storedTransactions ? JSON.parse(storedTransactions) : [],
    ownerships: storedOwnerships ? JSON.parse(storedOwnerships) : defaultTickets.map(ticket => ({
      ticketId: ticket.id,
      ownerId: ticket.sellerId,
      timestamp: new Date().toISOString(),
    })),
  };
};

export const TicketsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, updateUserBalance } = useAuth();
  const [data, setData] = useState(getStoredData);
  const { tickets, transactions, ownerships } = data;

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('ownerships', JSON.stringify(ownerships));
  }, [tickets, transactions, ownerships]);

  // Get current owner of a ticket
  const getCurrentOwner = (ticketId: string): string => {
    const ticketOwnerships = ownerships
      .filter(o => o.ticketId === ticketId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return ticketOwnerships.length > 0 ? ticketOwnerships[0].ownerId : '';
  };

  // Get user's purchased tickets (excluding resale listings)
  const userTickets = user 
    ? tickets.filter(ticket => {
        const isOwner = getCurrentOwner(ticket.id) === user.id;
        const hasTransaction = transactions.some(t => t.ticketId === ticket.id && t.buyerId === user.id);
        return isOwner && hasTransaction;
      })
    : [];

  // Get user's resale listings
  const userResaleListings = user
    ? tickets.filter(ticket => ticket.sellerId === user.id && ticket.isResale)
    : [];

  // Add or update a ticket
  const addTicket = (
    ticketData: Omit<Ticket, 'id' | 'sellerId' | 'sellerName' | 'available'>,
    existingTicketId?: string
  ): string => {
    if (!user) throw new Error('User must be logged in to add a ticket');

    const newTicketId = uuidv4();

    if (existingTicketId) {
      // Create new resale listing
      const newResaleTicket: Ticket = {
        ...ticketData,
        id: newTicketId,
        sellerId: user.id,
        sellerName: user.name,
        available: true,
        isResale: true,
        originalTicketId: existingTicketId,
      };

      setData(prev => ({
        ...prev,
        tickets: [...prev.tickets, newResaleTicket],
        ownerships: [...prev.ownerships, {
          ticketId: newTicketId,
          ownerId: user.id,
          timestamp: new Date().toISOString(),
        }],
      }));

      return newTicketId;
    } else {
      // Create new ticket
      const newTicket: Ticket = {
        ...ticketData,
        id: newTicketId,
        sellerId: user.id,
        sellerName: user.name,
        available: true,
        isResale: false,
      };
      
      setData(prev => ({
        ...prev,
        tickets: [...prev.tickets, newTicket],
        ownerships: [...prev.ownerships, {
          ticketId: newTicketId,
          ownerId: user.id,
          timestamp: new Date().toISOString(),
        }],
      }));
      
      return newTicketId;
    }
  };

  // Purchase a ticket
  const purchaseTicket = async (ticketId: string): Promise<boolean> => {
    if (!user) return false;
    
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket || !ticket.available) return false;
    
    // Check if user has enough balance
    if (user.balance < ticket.price) return false;
    
    // Get current owner
    const currentOwnerId = getCurrentOwner(ticketId);
    if (!currentOwnerId) return false;

    try {
      // Create the transaction
      const newTransaction: Transaction = {
        id: uuidv4(),
        ticketId,
        sellerId: currentOwnerId,
        buyerId: user.id,
        price: ticket.price,
        timestamp: new Date().toISOString(),
      };

      // Update data atomically
      setData(prev => {
        // Mark the ticket as unavailable
        const updatedTickets = prev.tickets.map(t => 
          t.id === ticketId ? { ...t, available: false } : t
        );

        // If this is a resale ticket, also mark the original ticket as unavailable
        if (ticket.isResale && ticket.originalTicketId) {
          const originalTicketIndex = updatedTickets.findIndex(t => t.id === ticket.originalTicketId);
          if (originalTicketIndex !== -1) {
            updatedTickets[originalTicketIndex] = {
              ...updatedTickets[originalTicketIndex],
              available: false
            };
          }
        }

        return {
          ...prev,
          tickets: updatedTickets,
          transactions: [...prev.transactions, newTransaction],
          ownerships: [...prev.ownerships, {
            ticketId,
            ownerId: user.id,
            timestamp: new Date().toISOString(),
          }],
        };
      });

      // Update balances
      updateUserBalance(currentOwnerId, ticket.price); // Update seller's balance
      updateUserBalance(user.id, -ticket.price); // Update buyer's balance
      
      return true;
    } catch (error) {
      console.error('Error during purchase:', error);
      return false;
    }
  };

  // Get ticket by ID
  const getTicketById = (id: string): Ticket | undefined => {
    return tickets.find(ticket => ticket.id === id);
  };

  return (
    <TicketsContext.Provider
      value={{
        tickets,
        transactions,
        ownerships,
        userTickets,
        userResaleListings,
        addTicket,
        purchaseTicket,
        getTicketById,
        getCurrentOwner,
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
};

// Custom hook for using the tickets context
export const useTickets = () => {
  const context = useContext(TicketsContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketsProvider');
  }
  return context;
};