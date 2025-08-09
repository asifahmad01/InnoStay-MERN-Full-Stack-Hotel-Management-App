import React, { useEffect, useState } from 'react';
import API from '../api/client';
import { Link } from 'react-router-dom';

export default function MenuList() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');

  const fetchData = type => {
    const url = type === 'all' ? '/menu' : `/menu/${type}`;
    API.get(url)
      .then(res => setItems(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  const handleDelete = async id => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await API.delete(`/menu/${id}`);
      fetchData(filter);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Menu</h2>
        <Link
          to="/menu/add"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
        >
          Add Item
        </Link>
      </div>

      <div className="mb-4 space-x-2">
        {['all','sweet','spicy','sour'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded ${
              filter === t ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <ul className="space-y-4">
        {items.map(item => (
          <li
            key={item._id}
            className="p-4 bg-white rounded shadow flex justify-between"
          >
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p>${item.price.toFixed(2)}</p>
            </div>
            <div className="space-x-2">
              <Link
                to={`/menu/${item._id}/edit`}
                className="text-blue-500 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(item._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
