import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const SearchHistory = ({ searchHistory, onClearHistory, onSelectLocation }) => (
  <div>
    {searchHistory.map((history) => (
      <div
        key={history.id}
        className="flex items-center justify-between mb-3 cursor-pointer hover:bg-gray-200 p-2 rounded"
        onClick={history.isCurrentLocation ? onSelectLocation : null} // Nếu là vị trí hiện tại thì gọi hàm lấy tọa độ
      >
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={history.icon} className="text-gray-500" />
          <span className="text-sm">{history.content}</span>
        </div>

        {/* Nút xóa chỉ hiển thị khi không phải "Vị trí hiện tại" */}
        {!history.isCurrentLocation && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Ngăn sự kiện click lan lên cha
              onClearHistory(history.id);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>
    ))}
  </div>
);

export default SearchHistory;  
