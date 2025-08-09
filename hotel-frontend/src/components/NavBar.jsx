// src/components/NavBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="text-xl font-bold">
          HotelMgmt
        </Link>
        <div className="space-x-4">
          <Link to="/staff" className="hover:text-secondary">
            Staff
          </Link>
          <Link to="/menu" className="hover:text-secondary">
            Menu
          </Link>
          <Link to="/profile" className="hover:text-secondary">
            Profile
          </Link>
          {user && (
            <button
              onClick={onLogout}
              className="ml-4 bg-secondary hover:bg-secondary/90 px-3 py-1 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
);
}
