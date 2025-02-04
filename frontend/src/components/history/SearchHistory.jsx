import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faClock } from '@fortawesome/free-solid-svg-icons';

const SearchHistory = ({ searchHistory, onSelectLocation, onClearHistory }) => (
  <div>
    {searchHistory.map((history) => (
      <div key={history.id} className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={history.icon} className="text-gray-500" />
          <span className="text-sm">{history.content}</span>
        </div>
        <button
          onClick={() => onClearHistory(history.id)}
          className="text-red-500 hover:text-red-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <button
          onClick={() => onSelectLocation(history.content, true)}
          className="text-blue-500 hover:text-blue-700"
        >
          Chọn
        </button>
      </div>
    ))}
  </div>
);

export default SearchHistory;
