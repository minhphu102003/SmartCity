import React, { useState } from 'react';
import { FaPlayCircle, FaEyeSlash, FaMapMarkerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { getYoutubeEmbedUrl } from '../../utils/youtube';
import MapPickerModal from './MapPickerModal';

const UpdateCameraModal = ({ camera, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    link: camera.link || '',
    status: camera.status || '',
    latitude: camera.latitude || null,
    longitude: camera.longitude || null,
  });

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
    onUpdate({ ...camera, ...formData });
  };

  const togglePreview = () => {
    setShowPreview((prev) => !prev);
  };

  const handlePickLocation = () => {
    setShowMapModal(true);
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white p-6 rounded shadow-lg max-w-xl w-full"
      >
        <h2 className="text-lg font-semibold mb-4">Update Camera</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Link + Preview */}
          <div>
            <label className="block text-sm font-medium">Camera Link</label>
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            {embedUrl && (
              <button
                type="button"
                onClick={togglePreview}
                className="flex items-center gap-2 mt-2 text-white bg-blue-600 px-3 py-1.5 rounded hover:bg-blue-700 transition"
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
                <div className="w-full aspect-video mt-2">
                  <iframe
                    src={embedUrl}
                    title="YouTube Preview"
                    className="w-full h-full rounded border"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm font-medium">Location</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePickLocation}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
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

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              required
            >
              <option value="">Select status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update
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

export default UpdateCameraModal;