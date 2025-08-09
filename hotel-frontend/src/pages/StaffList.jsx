import React, { useEffect, useState } from 'react';
import API from '../api/client';
import { Link } from 'react-router-dom';

export default function StaffList() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    API.get('/person')
      .then(res => setStaff(res.data))
      .catch(console.error);
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('Delete this staff?')) return;
    try {
      await API.delete(`/person/${id}`);
      setStaff(s => s.filter(x => x._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Staff</h2>
        <Link
          to="/staff/add"
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
        >
          Add Staff
        </Link>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            {['Name','Role','Mobile','Email','Actions'].map(h => (
              <th key={h} className="p-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {staff.map(s => (
            <tr key={s._id} className="border-t">
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.work}</td>
              <td className="p-2">{s.mobile}</td>
              <td className="p-2">{s.email}</td>
              <td className="p-2 space-x-2">
                <Link
                  to={`/staff/${s._id}/edit`}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
