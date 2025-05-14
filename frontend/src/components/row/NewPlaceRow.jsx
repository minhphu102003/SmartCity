import { useState } from 'react';
import { uploadImageToCloudinary } from '../../utils/uploadImageToCloudinary';
import { FiUpload } from 'react-icons/fi';
import { ImSpinner2 } from 'react-icons/im'; // icon loading

const NewPlaceRow = ({ newPlace, setNewPlace, onCreate }) => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <tr className="bg-gray-100">
      <td className="border p-2">
        <label
          className={`flex items-center justify-center gap-2 rounded px-3 py-2 text-white cursor-pointer
            ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
          `}
        >
          {isUploading ? (
            <ImSpinner2 className="animate-spin text-lg" />
          ) : (
            <FiUpload className="text-lg" />
          )}
          <span>{isUploading ? 'Uploading...' : 'Upload Img'}</span>

          <input
            type="file"
            accept="image/*"
            disabled={isUploading}
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;

              setIsUploading(true);
              try {
                const url = await uploadImageToCloudinary(file);
                setNewPlace((prev) => ({ ...prev, img: url }));
              } catch (error) {
                alert('Failed to upload image');
              } finally {
                setIsUploading(false);
              }
            }}
            className="hidden"
          />
        </label>

        {newPlace.img && (
          <img
            src={newPlace.img}
            alt="Preview"
            className="mt-2 max-h-24 rounded border object-contain"
          />
        )}
      </td>
      <td className="border p-2">
        <input
          type="text"
          placeholder="Name"
          value={newPlace.name}
          onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
          className="w-full rounded border border-gray-300 px-2 py-1"
        />
      </td>
      <td className="border p-2">
        <select
          value={newPlace.type}
          onChange={(e) => setNewPlace({ ...newPlace, type: e.target.value })}
          className="w-full rounded border border-gray-300 px-2 py-1"
        >
          <option value="Restaurant">Restaurant</option>
          <option value="Hotel">Hotel</option>
          <option value="Tourist destination">Tourist destination</option>
          <option value="Museum">Museum</option>
        </select>
      </td>
      <td className="border p-2 text-center text-sm italic text-gray-400">
        Auto-filled by coordinates
      </td>
      <td className="border p-2">
        <input
          type="number"
          min={0}
          max={5}
          value={newPlace.star}
          onChange={(e) =>
            setNewPlace({ ...newPlace, star: Number(e.target.value) })
          }
          className="w-full rounded border border-gray-300 px-2 py-1"
        />
      </td>
      <td className="border p-2 text-center">
        <input
          type="checkbox"
          checked={newPlace.status}
          onChange={(e) =>
            setNewPlace({ ...newPlace, status: e.target.checked })
          }
        />
      </td>
      <td className="border p-2">
        <input
          type="time"
          value={newPlace.timeOpen}
          onChange={(e) =>
            setNewPlace({ ...newPlace, timeOpen: e.target.value })
          }
          className="w-full rounded border border-gray-300 px-2 py-1"
        />
      </td>
      <td className="border p-2">
        <input
          type="time"
          value={newPlace.timeClose}
          onChange={(e) =>
            setNewPlace({ ...newPlace, timeClose: e.target.value })
          }
          className="w-full rounded border border-gray-300 px-2 py-1"
        />
      </td>
      <td className="border p-2 text-center">
        <button
          onClick={onCreate}
          className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
        >
          Create
        </button>
      </td>
    </tr>
  );
};

export default NewPlaceRow;
