import React from 'react';
import { FiUpload } from 'react-icons/fi';

const ImageUploadField = ({ onChange, preview }) => {
  return (
    <div className="my-3">
      <label
        htmlFor="image-upload"
        className="flex w-fit cursor-pointer items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        <FiUpload className="text-lg" />
        Upload Image
      </label>

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={onChange}
        className="hidden"
      />

      {preview && (
        <div className="mt-3">
          <p className="mb-1 text-sm text-gray-600">Preview:</p>
          <img
            src={preview}
            alt="Preview"
            className="max-h-40 rounded border border-gray-300 shadow"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
