import React, { useState } from 'react';
import API from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function AddMenu() {
  const [form, setForm] = useState({
    name: '',
    price: '',
    taste: 'sweet',
    is_drink: false,
    ingredients: '',
    num_sales: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await API.post('/menu', {
        ...form,
        price: parseFloat(form.price),
        num_sales: parseInt(form.num_sales, 10),
        ingredients: form.ingredients.split(',').map(i => i.trim()),
      });
      navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Add menu failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Add Menu Item</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Taste</label>
          <select
            name="taste"
            value={form.taste}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            {['sweet','spicy','sour'].map(t => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <input
            name="is_drink"
            type="checkbox"
            checked={form.is_drink}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Is Drink?</label>
        </div>
        <div>
          <label className="block mb-1">Ingredients (comma-separated)</label>
          <input
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Initial Sales</label>
          <input
            name="num_sales"
            type="number"
            value={form.num_sales}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
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
