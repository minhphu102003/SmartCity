import React from 'react';
import Cropper from 'react-easy-crop';

const ImageCropModal = ({
  image,
  crop,
  zoom,
  setCrop,
  setZoom,
  onCropComplete,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative h-96 w-96 rounded bg-white p-4 shadow-xl">
        <div className="relative h-72 w-full">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          >
            Crop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
