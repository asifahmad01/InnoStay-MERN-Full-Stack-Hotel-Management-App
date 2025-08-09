// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    age: '',
    work: '',
    mobile: '',
    email: '',
    address: '',
    salary: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'Age', name: 'age', type: 'number' },
          { label: 'Role', name: 'work', type: 'text' },
          { label: 'Mobile', name: 'mobile', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Address', name: 'address', type: 'text' },
          { label: 'Salary', name: 'salary', type: 'number' },
          { label: 'Username', name: 'username', type: 'text' },
          { label: 'Password', name: 'password', type: 'password' },
        ].map(field => (
          <div key={field.name}>
            <label className="block mb-1">{field.label}</label>
            <input
              className="w-full border px-3 py-2 rounded"
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
