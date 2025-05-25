import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CameraRow = ({ camera, address, onEdit, onDelete, onView }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(prev => !prev);

  return (
    <motion.tr
      className="align-top cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200"
      onClick={toggleExpand}
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <td className="border border-gray-200 px-4 py-3" style={{ maxWidth: '150px' }}>
        <motion.div
          initial={{ height: 24, overflow: 'hidden' }}
          animate={{ height: expanded ? 'auto' : 24 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="text-gray-700 text-sm"
          style={{ whiteSpace: expanded ? 'normal' : 'nowrap', textOverflow: 'ellipsis' }}
        >
          {camera.link}
        </motion.div>
      </td>

      <td className="border border-gray-200 px-4 py-3">
        <div className="flex items-center justify-center space-x-2">
          <span
            className={`inline-block w-3 h-3 rounded-full ${camera.status ? 'bg-green-500' : 'bg-red-500'} transition-all duration-300`}
            title={camera.status ? 'Active' : 'Inactive'}
          />
          <span className="text-xs font-medium text-gray-600">
            {camera.status ? 'Active' : 'Inactive'}
          </span>
        </div>
      </td>

      <td className="border border-gray-200 px-4 py-3 text-left" style={{ maxWidth: '200px' }}>
        <motion.div
          initial={{ height: 24, overflow: 'hidden' }}
          animate={{ height: expanded ? 'auto' : 24 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="text-gray-700 text-sm"
          style={{ whiteSpace: expanded ? 'normal' : 'nowrap', textOverflow: 'ellipsis' }}
        >
          {address || 'Loading address...'}
        </motion.div>
      </td>

      <td className="border border-gray-200 px-4 py-3 text-gray-700 text-sm">
        {new Date(camera.installation_date).toLocaleDateString()}
      </td>

      <td className="border border-gray-200 px-4 py-3 space-x-2" onClick={(e) => e.stopPropagation()}>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow-md"
          onClick={() => onEdit(camera)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-red-600 transition-colors duration-200 shadow-sm hover:shadow-md"
          onClick={() => onDelete(camera)}
        >
          Delete
        </button>
        <button
          className="bg-gray-500 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-gray-600 transition-colors duration-200 shadow-sm hover:shadow-md"
          onClick={() => onView(camera)}
        >
          View
        </button>
      </td>
    </motion.tr>
  );
};

export default CameraRow;