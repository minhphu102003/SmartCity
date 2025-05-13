import React, { useEffect, useState } from 'react';
import { getNearestPlaces } from '../../services/place';
import PlaceRow from '../../components/row/PlaceRow';

const AdminPlacesTable = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocationAndPlaces = async () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await getNearestPlaces(latitude, longitude, 500, null, 100, 1);
            setPlaces(response?.data?.data || []);
          } catch (err) {
            console.error('Failed to fetch places:', err);
            setError('Failed to fetch places.');
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Permission denied or unable to get location.');
          setLoading(false);
        }
      );
    };

    fetchLocationAndPlaces();
  }, []);

  const handleChange = (id, field, value) => {
    setPlaces((prev) =>
      prev.map((place) => (place.id === id ? { ...place, [field]: value } : place))
    );
  };

  const handleSave = (id) => {
    const updatedPlace = places.find((p) => p.id === id);
    console.log('Save this place to backend:', updatedPlace);
  };

  const renderSkeletonRows = (count = 5) => {
    return Array.from({ length: count }).map((_, index) => (
      <tr key={index}>
        {Array.from({ length: 10 }).map((__, i) => (
          <td key={i} className="border p-2">
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
            <th className="border p-2">Latitude</th>
            <th className="border p-2">Longitude</th>
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
        </tbody>
      </table>
    </div>
  );
};

export default AdminPlacesTable;
