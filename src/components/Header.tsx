import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Ticket, Search, User, LogOut, Menu, X, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white dark:bg-gray-800 shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Ticket className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
              TicketSwap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                location.pathname === '/' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : ''
              }`}
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                    location.pathname === '/dashboard' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : ''
                  }`}
                >
                  My Tickets
                </Link>
                <Link 
                  to="/sell" 
                  className={`transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                    location.pathname === '/sell' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : ''
                  }`}
                >
                  Sell Ticket
                </Link>
                {user?.isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                      location.pathname === '/admin' ? 'text-indigo-600 dark:text-indigo-400 font-medium' : ''
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right side - User area */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <span className="block font-medium">{user?.name}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    {user?.balance} Units
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
          <div className="px-4 py-3 space-y-4">
            <Link 
              to="/" 
              className="block py-2 hover:text-indigo-600 dark:hover:text-indigo-400"
              onClick={closeMenu}
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block py-2 hover:text-indigo-600 dark:hover:text-indigo-400"
                  onClick={closeMenu}
                >
                  My Tickets
                </Link>
                <Link 
                  to="/sell" 
                  className="block py-2 hover:text-indigo-600 dark:hover:text-indigo-400"
                  onClick={closeMenu}
                >
                  Sell Ticket
                </Link>
                {user?.isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block py-2 hover:text-indigo-600 dark:hover:text-indigo-400"
                    onClick={closeMenu}
                  >
                    Admin
                  </Link>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 my-2 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {user?.balance} Units
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={toggleDarkMode} 
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {isDarkMode ? (
                          <Sun className="w-5 h-5" />
                        ) : (
                          <Moon className="w-5 h-5" />
                        )}
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={toggleDarkMode} 
                    className="flex items-center justify-between py-2"
                  >
                    <span>Toggle Theme</span>
                    {isDarkMode ? (
                      <Sun className="w-5 h-5" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </button>
                  <Link 
                    to="/login" 
                    className="block py-2 text-center rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={closeMenu}
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register" 
                    className="block py-2 text-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;