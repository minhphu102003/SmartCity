import { Popup } from 'react-map-gl';
import { useEffect } from 'react';

const EditRoadSegmentPopup = ({
  segment,
  editingData,
  setEditingData,
  onSave,
  onClose,
}) => {

  useEffect(() => {
    setEditingData({
      id: segment._id,
      roadName: segment.roadName || '',
      raiseHeight: segment.raiseHeight || '',
    });
  }, [segment, setEditingData]);

  if (!segment) return null;

  const [lng, lat] = segment.roadSegmentLine.coordinates[0];

  return (
    <Popup
      longitude={lng}
      latitude={lat}
      onClose={onClose}
      closeOnClick={false}
    >
      <div className="space-y-2 min-w-[200px] z-50">
        <h4 className="font-bold text-base">Edit Road Segment</h4>

        <p>Groundwater Level: {segment.groundwater_level}</p>

        <label className="block text-sm font-medium">Road Name</label>
        <input
          type="text"
          value={editingData.roadName}
          onChange={(e) =>
            setEditingData((prev) => ({
              ...prev,
              roadName: e.target.value,
            }))
          }
          className="w-full border p-1 rounded"
          placeholder="Enter road name"
        />

        <label className="block text-sm font-medium">Raise Height (cm)</label>
        <input
          type="number"
          min="0"
          value={editingData.raiseHeight}
          onChange={(e) =>
            setEditingData((prev) => ({
              ...prev,
              raiseHeight: e.target.value,
            }))
          }
          className="w-full border p-1 rounded"
          placeholder="e.g., 20"
        />

        <button
          onClick={onSave}
          className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </Popup>
  );
};

export default EditRoadSegmentPopup;
