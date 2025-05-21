import React from 'react';

const ContextMenu = ({
  contextMenu,
  onToggleRoadSegment,
  onCreateCamera,
  onCreateNotification,
  onClose,
}) => {
  if (!contextMenu) return null;

  return (
    <div
      className="absolute z-50 rounded-md bg-white p-2 shadow-lg"
      style={{ top: contextMenu.y, left: contextMenu.x }}
    >
      <button
        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
        onClick={() => {
          onToggleRoadSegment(contextMenu.longitude, contextMenu.latitude);
          onClose();
        }}
      >
        Toggle View RoadSegment
      </button>
      <button
        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
        onClick={() => {
          onCreateCamera(contextMenu.longitude, contextMenu.latitude);
          onClose();
        }}
      >
        Create Camera Here
      </button>
      <button
        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
        onClick={() => {
          onCreateNotification(contextMenu.longitude, contextMenu.latitude);
          onClose();
        }}
      >
        Create Notification Here
      </button>
      <button
        className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-200"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default ContextMenu;
