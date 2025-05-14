import React, { useState } from 'react';
import PlaceRow from '../../components/row/PlaceRow';
import NewPlaceRow from '../../components/row/NewPlaceRow';
import usePlaces from '../../hooks/usePlaces';

const AdminPlacesTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    places,
    setPlaces,
    loading,
    error,
    totalPages,
  } = usePlaces(currentPage);

  const [newPlace, setNewPlace] = useState({
    name: '',
    type: 'Restaurant',
    img: '',
    star: 0,
    status: true,
    timeOpen: '',
    timeClose: '',
  });

  const handleChange = (id, field, value) => {
    setPlaces((prev) =>
      prev.map((place) => (place.id === id ? { ...place, [field]: value } : place))
    );
  };

  const handleSave = (id) => {
    const updatedPlace = places.find((p) => p.id === id);
    console.log('Save this place to backend:', updatedPlace);
  };

  const handleCreate = () => {
    console.log('Creating new place:', newPlace);
    setNewPlace({
      name: '',
      type: 'Restaurant',
      img: '',
      star: 0,
      status: true,
      timeOpen: '',
      timeClose: '',
    });
  };

  const renderSkeletonRows = (count = 12) => {
    return Array.from({ length: count }).map((_, index) => (
      <tr key={index}>
        {Array.from({ length: 10 }).map((__, i) => (
          <td key={i} className="border p-5">
            <div className="h-5 w-full bg-gray-200 animate-pulse rounded" />
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="p-4 overflow-auto">
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Star</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Open</th>
            <th className="border p-2">Close</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? renderSkeletonRows(6)
            : places.map((place) => (
              <PlaceRow
                key={place.id}
                place={place}
                onChange={handleChange}
                onSave={handleSave}
              />
            ))}

          {!loading && <NewPlaceRow
            newPlace={newPlace}
            setNewPlace={setNewPlace}
            onCreate={handleCreate}
          />}
        </tbody>
      </table>
      {!loading && places.length > 0 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPlacesTable;
