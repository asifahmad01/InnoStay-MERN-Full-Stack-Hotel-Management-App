// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <NavBar />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6">
        <Outlet />     {/* ← this is where nested routes will render */}
      </main>
      <footer className="text-center py-4 text-sm text-gray-500">
        &copy; 2025 Hotel Management
      </footer>
    </div>
  );
}
