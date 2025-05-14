const PlaceRow = ({ place, onChange, onSave }) => {
  return (
    <tr key={place.id} className="hover:bg-gray-50">
      <td className="border p-2">
        <img
          src={place.img}
          alt={place.name}
          className="h-14 w-14 rounded object-cover"
        />
      </td>
      <td className="border p-2">
        <input
          type="text"
          value={place.name}
          onChange={(e) => onChange(place.id, 'name', e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1"
        />
      </td>
      <td className="border p-2">
        <select
          value={place.type}
          onChange={(e) => onChange(place.id, 'type', e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1"
        >
          <option value="Restaurant">Restaurant</option>
          <option value="Hotel">Hotel</option>
          <option value="Tourist destination">Tourist destination</option>
          <option value="Museum">Museum</option>
        </select>
      </td>
      <td className="border p-2 align-top">
        <div className="min-w-[120px] max-w-[200px] whitespace-normal break-words">
          {!place.address ? (
            <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
          ) : (
            place.address
          )}
        </div>
      </td>
      <td className="border p-2">
        <input
          type="number"
          min={0}
          max={5}
          value={place.star}
          onChange={(e) => onChange(place.id, 'star', Number(e.target.value))}
          className="w-full rounded border border-gray-300 px-2 py-1"
        />
      </td>
      <td className="border p-2 text-center">
        <input
          type="checkbox"
          checked={place.status}
          onChange={(e) => onChange(place.id, 'status', e.target.checked)}
        />
      </td>
      <td className="border p-2">
        <input
          type="time"
          value={place.timeOpen || ''}
          onChange={(e) => onChange(place.id, 'timeOpen', e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1"
        />
      </td>
      <td className="border p-2">
        <input
          type="time"
          value={place.timeClose || ''}
          onChange={(e) => onChange(place.id, 'timeClose', e.target.value)}
          className="w-full rounded border border-gray-300 px-2 py-1"
        />
      </td>
      <td className="border p-2 text-center">
        <button
          onClick={() => onSave(place.id)}
          className="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
        >
          Save
        </button>
      </td>
    </tr>
  );
};

export default PlaceRow;
