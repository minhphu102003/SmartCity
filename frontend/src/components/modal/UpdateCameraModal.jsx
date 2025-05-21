import React, { useState, useEffect } from 'react';
import { FaPlayCircle, FaEyeSlash, FaMapMarkerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getYoutubeEmbedUrl } from '../../utils/youtube';
import MapPickerModal from './MapPickerModal';

const CameraModal = ({
  initialData = {},
  onClose,
  onSubmit,
  mode = 'create',
}) => {
  const [formData, setFormData] = useState({
    link: '',
    status: 'true',
    latitude: null,
    longitude: null,
    installation_date: '',
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      _id: initialData._id || '',
      link: initialData.link || '',
      status: String(initialData.status ?? 'true'),
      latitude: initialData.latitude || null,
      longitude: initialData.longitude || null,
      installation_date: initialData.installation_date || '',
    }));
  }, []);

  const [showPreview, setShowPreview] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const embedUrl = getYoutubeEmbedUrl(formData.link);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'link') {
      setShowPreview(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      status: formData.status === 'true',
    };
    onSubmit(payload);
  };

  const handleLocationSelected = ({ lat, lng }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    setShowMapModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-xl rounded bg-white p-6 shadow-lg"
      >
        <h2 className="mb-4 text-lg font-semibold">
          {mode === 'create' ? 'Create Camera' : 'Update Camera'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Camera Link</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            {embedUrl && (
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="mt-2 flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
              >
                {showPreview ? <FaEyeSlash /> : <FaPlayCircle />}
                {showPreview ? 'Hide Preview' : 'Preview Video'}
              </button>
            )}
          </div>

          <AnimatePresence>
            {showPreview && embedUrl && (
              <motion.div
                key="iframe"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-2 aspect-video w-full">
                  <iframe
                    src={embedUrl}
                    title="YouTube Preview"
                    className="h-full w-full rounded border"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {mode !== 'create' && (
            <div>
              <label className="block text-sm font-medium">Location</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="flex items-center gap-2 rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                >
                  <FaMapMarkerAlt />
                  Pick Location on Map
                </button>
                {formData.latitude && formData.longitude && (
                  <span className="text-sm text-gray-700">
                    ({formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)})
                  </span>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2"
              required
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {mode === 'create' && (
            <div>
              <label className="block text-sm font-medium">Installation Date</label>
              <input
                type="date"
                name="installation_date"
                value={formData.installation_date}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
                required
              />
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {mode === 'create' ? 'Create' : 'Update'}
            </button>
          </div>
        </form>
      </motion.div>

      {showMapModal && (
        <MapPickerModal
          initialLocation={{
            lat: formData.latitude || 10.762622,
            lng: formData.longitude || 106.660172,
          }}
          onClose={() => setShowMapModal(false)}
          onSelect={handleLocationSelected}
        />
      )}
    </div>
  );
};

export default CameraModal;
