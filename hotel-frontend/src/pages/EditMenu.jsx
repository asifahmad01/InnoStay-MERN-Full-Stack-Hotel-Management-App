import React, { useEffect, useState } from 'react';
import API from '../api/client';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditMenu() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/menu/${id}`)
      .then(res => {
        setForm({
          ...res.data,
          ingredients: res.data.ingredients.join(', '),
          price: res.data.price.toString(),
          num_sales: res.data.num_sales.toString(),
        });
      })
      .catch(() => setError('Failed to load'));
  }, [id]);

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
      await API.put(`/menu/${id}`, {
        ...form,
        price: parseFloat(form.price),
        num_sales: parseInt(form.num_sales, 10),
        ingredients: form.ingredients.split(',').map(i => i.trim()),
      });
      navigate('/menu');
    } catch {
      setError('Update failed');
    }
  };

  if (!form) return <p className="p-4">Loading…</p>;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Menu Item</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Name', name: 'name', type: 'text' },
          { label: 'Price', name: 'price', type: 'number' },
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
          <label className="block mb-1">Ingredients</label>
          <input
            className="w-full border px-3 py-2 rounded"
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-1">Sales</label>
          <input
            className="w-full border px-3 py-2 rounded"
            name="num_sales"
            type="number"
            value={form.num_sales}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
