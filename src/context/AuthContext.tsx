import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Define user interface
interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  isAdmin: boolean;
}

// Define context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserBalance: (userId: string, amount: number) => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateUserBalance: () => {},
});

interface StoredUser extends User {
  password: string;
}

// Get stored users from localStorage
const getStoredUsers = (): StoredUser[] => {
  const storedUsers = localStorage.getItem('registeredUsers');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  // Default admin and user accounts if no users exist
  const defaultUsers = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      balance: 1000,
      isAdmin: true,
    },
    {
      id: '2',
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
      balance: 500,
      isAdmin: false,
    },
  ];
  localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
  return defaultUsers;
};

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<StoredUser[]>(getStoredUsers);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved user session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('userSession');
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      const foundUser = users.find(u => u.id === sessionData.id);
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
      }
    }
    setIsLoading(false);
  }, [users]);

  // Save users whenever they change
  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  }, [users]);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('userSession', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return false;
    }
    
    // Create new user
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      balance: 200, // Starting balance
      isAdmin: false,
    };
    
    // Update users array
    setUsers(prevUsers => {
      const updatedUsers = [...prevUsers, newUser];
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
    
    // Log in the user
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('userSession', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userSession');
  };

  // Update user balance
  const updateUserBalance = (userId: string, amount: number) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(u => {
        if (u.id === userId) {
          const newBalance = u.balance + amount;
          // If this is the current user, update their session
          if (user && user.id === userId) {
            const updatedUser = { ...user, balance: newBalance };
            setUser(updatedUser);
            localStorage.setItem('userSession', JSON.stringify(updatedUser));
          }
          return { ...u, balance: newBalance };
        }
        return u;
      });
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      return updatedUsers;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUserBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => React.useContext(AuthContext);