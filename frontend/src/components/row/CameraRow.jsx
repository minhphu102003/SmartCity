import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CameraRow = ({ camera, address, onEdit, onDelete, onView }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(prev => !prev);

  return (
    <tr className="align-top cursor-pointer" onClick={toggleExpand}>
      <td className="border px-2 py-1" style={{ maxWidth: '150px' }}>
        <motion.div
          initial={{ height: 24, overflow: 'hidden' }}
          animate={{ height: expanded ? 'auto' : 24 }}
          transition={{ duration: 0.3 }}
          style={{ whiteSpace: expanded ? 'normal' : 'nowrap', textOverflow: 'ellipsis' }}
        >
          {camera.link}
        </motion.div>
      </td>

      <td className="border px-2 py-1 flex items-center justify-center space-x-2">
        <span
          className={`inline-block w-3 h-3 rounded-full ${camera.status ? 'bg-green-500' : 'bg-red-500'}`}
          title={camera.status ? 'Active' : 'Inactive'}
        />
        <span className="text-xs">{camera.status ? 'Active' : 'Inactive'}</span>
      </td>

      <td className="border px-2 py-1 text-left" style={{ maxWidth: '200px' }}>
        <motion.div
          initial={{ height: 24, overflow: 'hidden' }}
          animate={{ height: expanded ? 'auto' : 24 }}
          transition={{ duration: 0.3 }}
          style={{ whiteSpace: expanded ? 'normal' : 'nowrap', textOverflow: 'ellipsis' }}
        >
          {address || 'Loading address...'}
        </motion.div>
      </td>

      <td className="border px-2 py-1">
        {new Date(camera.installation_date).toLocaleDateString()}
      </td>

      <td className="border px-2 py-1 space-x-2" onClick={(e) => e.stopPropagation()}>
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
          onClick={() => onEdit(camera)}
        >
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
          onClick={() => onDelete(camera)}
        >
          Delete
        </button>
        <button
          className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
          onClick={() => onView(camera)}
        >
          View
        </button>
      </td>
    </tr>
  );
};

export default CameraRow;
