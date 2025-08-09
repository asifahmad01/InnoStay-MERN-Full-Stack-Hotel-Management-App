import React, { useState } from 'react';
import API from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function AddStaff() {
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
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/person/signup', form);
      navigate('/staff');
    } catch (err) {
      setError(err.response?.data?.message || 'Add staff failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Staff</h2>
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
        ].map(f => (
          <div key={f.name}>
            <label className="block mb-1">{f.label}</label>
            <input
              className="w-full border px-3 py-2 rounded"
              type={f.type}
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded"
        >
          Create
        </button>
      </form>
    </div>
  );
}
