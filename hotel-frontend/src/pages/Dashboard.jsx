import React, { useEffect, useState } from 'react';
import API from '../api/client';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get('/person/profile')
      .then(res => setProfile(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-6">
        {profile ? `Hello, ${profile.name}` : 'Loading...'}
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/staff" className="p-4 bg-white rounded shadow hover:bg-gray-50">
          Manage Staff
        </Link>
        <Link to="/menu" className="p-4 bg-white rounded shadow hover:bg-gray-50">
          Manage Menu
        </Link>
        <Link to="/profile" className="p-4 bg-white rounded shadow hover:bg-gray-50">
          My Profile
        </Link>
        <Link to="/" className="p-4 bg-white rounded shadow hover:bg-gray-50">
          Logout
        </Link>
      </div>
    </div>
  );
}
