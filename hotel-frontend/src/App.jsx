// src/App.jsx
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Layout         from './components/Layout';
// src/App.jsx
import { AuthProvider } from './contexts/AuthProvider';



import Welcome   from './pages/welcome';
import Signup    from './pages/Signup';
import Login     from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile   from './pages/Profile';
import StaffList from './pages/StaffList';
import AddStaff  from './pages/AddStaff';
import EditStaff from './pages/EditStaff';
import MenuList  from './pages/MenuList';
import AddMenu   from './pages/AddMenu';
import EditMenu  from './pages/EditMenu';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Welcome />} />
        <Route path="signup" element={<Signup />} />
        <Route path="login"  element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          {/* Layout wraps all these */}
          <Route element={<Layout />}>
            <Route path="dashboard"      element={<Dashboard />} />
            <Route path="profile"        element={<Profile />} />
            <Route path="staff"          element={<StaffList />} />
            <Route path="staff/add"      element={<AddStaff />} />
            <Route path="staff/:id/edit" element={<EditStaff />} />
            <Route path="menu"           element={<MenuList />} />
            <Route path="menu/add"       element={<AddMenu />} />
            <Route path="menu/:id/edit"  element={<EditMenu />} />
          </Route>
        </Route>

        {/* Catch-all: redirect back to Welcome */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
