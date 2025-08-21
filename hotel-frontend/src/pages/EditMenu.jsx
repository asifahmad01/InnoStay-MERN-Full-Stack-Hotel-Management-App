import React, { useEffect, useState } from 'react';
import API from '../api/client';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditMenu() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError('');
    API.get(`/menu/${id}`)
      .then(res => {
        if (!alive) return;
        const d = res.data || {};
        setForm({
          name: d.name || '',
          price: d.price != null ? String(d.price) : '',
          taste: d.taste || 'sweet',
          is_drink: !!d.is_drink,
          ingredients: Array.isArray(d.ingredients) ? d.ingredients.join(', ') : '',
          num_sales: d.num_sales != null ? String(d.num_sales) : '0',
          description: d.description || '',
        });
      })
      .catch(err => {
        if (!alive) return;
        setError(err?.response?.status === 404 ? 'This menu item was not found.' : 'Failed to load');
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name.trim(),
        price: parseFloat(form.price),
        taste: form.taste,
        is_drink: !!form.is_drink,
        num_sales: form.num_sales === '' ? 0 : parseInt(form.num_sales, 10),
        ingredients: String(form.ingredients || '')
          .split(',')
          .map(i => i.trim())
          .filter(Boolean),
        description: form.description?.trim() || '',
      };
      await API.put(`/menu/${id}`, payload);
      navigate('/menu');
    } catch {
      setError('Update failed');
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
        <div className="h-6 w-40 bg-gray-100 animate-pulse rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
        <p className="text-red-600 mb-3">{error || 'Failed to load'}</p>
        <button
          onClick={() => navigate('/menu')}
          className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Menu Item</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Price (keep as text for free typing; parse on submit) */}
        <div>
          <label className="block mb-1">Price</label>
          <input
            className="w-full border px-3 py-2 rounded"
            type="text"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="e.g., 249.00"
            required
          />
        </div>

        {/* Taste */}
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

        {/* Is drink */}
        <label className="flex items-center gap-2">
          <input
            name="is_drink"
            type="checkbox"
            checked={form.is_drink}
            onChange={handleChange}
          />
          <span>Is Drink?</span>
        </label>

        {/* Ingredients */}
        <div>
          <label className="block mb-1">Ingredients</label>
          <input
            className="w-full border px-3 py-2 rounded"
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            placeholder="Comma-separated, e.g., Rice, Peas, Spices"
          />
        </div>

        {/* Sales */}
        <div>
          <label className="block mb-1">Sales</label>
          <input
            className="w-full border px-3 py-2 rounded"
            name="num_sales"
            type="text"
            value={form.num_sales}
            onChange={handleChange}
            placeholder="e.g., 120"
          />
        </div>

        {/* Optional description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full border px-3 py-2 rounded"
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            placeholder="Short description (optional)"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => navigate('/menu')}
          className="w-full mt-2 py-2 border rounded hover:bg-gray-50"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
