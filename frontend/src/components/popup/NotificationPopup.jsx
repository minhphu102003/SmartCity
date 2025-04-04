import React, { useState, useEffect } from 'react';

import { fetchAddress } from '../../services/openCageService';

const NotificationPopup = ({
  x,
  y,
  longitude,
  latitude,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('Loading address...');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const getAddress = async () => {
      try {
        const result = await fetchAddress(latitude, longitude);
        setAddress(result);
      } catch (error) {
        setAddress('Error fetching address');
      } finally {
        setLoading(false);
      }
    };

    getAddress();
  }, [latitude, longitude]);

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({ title, message, longitude, latitude, address });
    onClose();
  };

  return (
    <div
      className="w-128 absolute z-50 rounded-md border border-gray-300 bg-white p-4 shadow-lg"
      style={{ top: y, left: x }}
    >
      <h3 className="mb-2 text-lg font-semibold">Create Notification</h3>

      <div className="mb-2 text-sm text-gray-700">
        <span className="font-medium">Location:</span>{' '}
        {loading ? 'Loading...' : address}
      </div>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (errors.title) {
            setErrors((prev) => ({ ...prev, title: undefined }));
          }
        }}
        className={`mb-1 w-full rounded border px-2 py-1 text-sm ${errors.title ? 'border-red-500' : ''}`}
      />
      {errors.title && (
        <p className="mb-2 text-xs text-red-500">{errors.title}</p>
      )}

      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          if (errors.message) {
            setErrors((prev) => ({ ...prev, message: undefined }));
          }
        }}
        className={`mb-1 w-full rounded border px-2 py-1 text-sm ${errors.message ? 'border-red-500' : ''}`}
      />
      {errors.message && (
        <p className="mb-2 text-xs text-red-500">{errors.message}</p>
      )}
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="rounded bg-gray-300 px-3 py-1 text-sm hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default NotificationPopup;
