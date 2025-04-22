import React, { useState, useEffect } from 'react';
import { fetchAddress } from '../../services/openCageService';
import { getCroppedImg } from '../../utils/cropImage';

import ImageUploadField from './ImageUploadField';
import ImageCropModal from './ImageCropModal';

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

  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (croppedImage) {
      const objectUrl = URL.createObjectURL(croppedImage);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [croppedImage]);

  useEffect(() => {
    const getAddress = async () => {
      try {
        const result = await fetchAddress(latitude, longitude);
        setAddress(result);
      } catch {
        setAddress('Error fetching address');
      } finally {
        setLoading(false);
      }
    };
    getAddress();
  }, [latitude, longitude]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setShowCropModal(true);
    }
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    const cropped = await getCroppedImg(image, croppedAreaPixels);
    setCroppedImage(cropped);
    setShowCropModal(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      title,
      message,
      longitude,
      latitude,
      address,
      img: croppedImage,
    });
    onClose();
  };

  return (
    <div
      className={`w-128 z-50 rounded-md border border-gray-300 bg-white p-4 shadow-lg ${
        croppedImage
          ? 'fixed left-1/2 top-1/2 max-h-screen -translate-x-1/2 -translate-y-1/2 overflow-y-auto'
          : 'absolute'
      }`}
      style={!croppedImage ? { top: y, left: x } : undefined}
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
          if (errors.title)
            setErrors((prev) => ({ ...prev, title: undefined }));
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
          if (errors.message)
            setErrors((prev) => ({ ...prev, message: undefined }));
        }}
        className={`mb-1 w-full rounded border px-2 py-1 text-sm ${errors.message ? 'border-red-500' : ''}`}
      />
      {errors.message && (
        <p className="mb-2 text-xs text-red-500">{errors.message}</p>
      )}

      <ImageUploadField onChange={handleFileChange} preview={previewUrl} />

      {showCropModal && (
        <ImageCropModal
          image={image}
          crop={crop}
          zoom={zoom}
          setCrop={setCrop}
          setZoom={setZoom}
          onCropComplete={onCropComplete}
          onClose={() => setShowCropModal(false)}
          onConfirm={handleCropConfirm}
        />
      )}

      {croppedImage && (
        <div className="mb-2 flex justify-between">
          <button
            onClick={() => {
              setImage(null);
              setCroppedImage(null);
            }}
            className="rounded border border-transparent px-2 py-1 text-sm text-red-600 transition hover:border-red-600 hover:bg-red-50"
          >
            Remove Image
          </button>
          <button
            onClick={() => setShowCropModal(true)}
            className="rounded border border-transparent px-2 py-1 text-sm text-blue-600 transition hover:border-blue-600 hover:bg-blue-50"
          >
            Recrop
          </button>
        </div>
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
