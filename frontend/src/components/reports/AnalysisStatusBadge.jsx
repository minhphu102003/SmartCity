import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const AnalysisStatusBadge = ({ status }) => {
  let colorClass = '';
  let text = '';
  let IconComponent = null;

  if (status === true) {
    colorClass = 'bg-green-100 text-green-800';
    text = 'Completed';
    IconComponent = FiCheckCircle;
  } else if (status === false) {
    colorClass = 'bg-red-100 text-red-800';
    text = 'Rejected';
    IconComponent = FiXCircle;
  } else {
    colorClass = 'bg-yellow-100 text-yellow-800';
    text = 'Pending';
    IconComponent = FiClock;
  }

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}>
      {IconComponent && <IconComponent className="w-4 h-4" />}
      {text}
    </span>
  );
};

export default AnalysisStatusBadge;