import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketDetails from './pages/TicketDetails';
import SellTicket from './pages/SellTicket';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Context
import { AuthProvider } from './context/AuthContext';
import { TicketsProvider } from './context/TicketsContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TicketsProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="ticket/:id" element={<TicketDetails />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="sell" element={<SellTicket />} />
              </Route>
              
              {/* Admin routes */}
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Routes>
        </TicketsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;