import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/client';

export default function EditStaff() {
  const { id } = useParams();
  const navigate = useNavigate();

  // form state & error
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  // load existing staff data
  useEffect(() => {
    API.get(`/person/${id}`)
      .then(res => setForm(res.data))
      .catch(() => setError('Failed to load staff data'));
  }, [id]);

  // <-- define handleChange BEFORE using it in JSX
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.put(`/person/${id}`, form);
      navigate('/staff');
    } catch {
      setError('Update failed');
    }
  };

  if (!form) return <p className="p-4">Loading…</p>;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Staff</h2>
      {error && <p className="mb-2 text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name','age','work','mobile','email','address','salary'].map(key => (
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
          Save
        </button>
      </form>
    </div>
  );
}
