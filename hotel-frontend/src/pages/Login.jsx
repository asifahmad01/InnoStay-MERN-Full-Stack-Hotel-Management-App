// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';


export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e =>
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await login(credentials.username, credentials.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {['username', 'password'].map(name => (
          <div key={name}>
            <label className="block mb-1 capitalize">{name}</label>
            <input
              className="w-full border px-3 py-2 rounded"
              type={name === 'password' ? 'password' : 'text'}
              name={name}
              value={credentials[name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Don't have an account?{' '}
        <Link to="/signup" className="text-green-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
