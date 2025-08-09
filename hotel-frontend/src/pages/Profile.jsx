// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import API from '../api/client';
import { useAuth } from '../hooks/useAuth';

export default function Profile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    API.get('/person/profile')
      .then(res => setForm(res.data))
      .catch(err => {
        console.error(err);
        setMsg('Failed to load profile');
      });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.put(`/person/${user._id}`, form);
      setMsg('Profile updated');
    } catch (err) {
      console.error(err);
      setMsg('Update failed');
    }
  };

  if (!form) return <p className="p-4">Loading…</p>;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      {msg && (
        <p className={`mb-2 ${msg.includes('failed') ? 'text-red-500' : 'text-green-600'}`}>
          {msg}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'age', 'work', 'mobile', 'email', 'address', 'salary'].map(key => (
          <div key={key}>
            <label className="block mb-1 capitalize">{key}</label>
            <input
              className="w-full border px-3 py-2 rounded"
              type={key === 'age' || key === 'salary' ? 'number' : 'text'}
              name={key}
              value={form[key] || ''}
              onChange={handleChange}
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Save Changes
        </button>
      </form>
      <button
        onClick={logout}
        className="mt-4 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
