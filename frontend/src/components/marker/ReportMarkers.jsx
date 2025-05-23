import { Marker } from "react-map-gl";
import { faWater, faCar, faBell } from "@fortawesome/free-solid-svg-icons";
import MapIcon from '../icons/MapIcon';

const ReportMarkers = ({ reports, selectedReport, setSelectedReport, zoom }) => {
  if (!reports || reports.length === 0) return null;

  const getScaledSize = (zoom, base = 14, min = 24, max = 60) => {
    return Math.max(min, Math.min(max, base * zoom));
  };

  return (
    <>
      {reports.map((report) => {
        const type = report?.typeReport?.toLowerCase() || '';
        let iconColor = 'text-blue-600';
        let borderColor = 'border-blue-600';
        let icon = faWater;

        if (type.startsWith('t')) {
          iconColor = 'text-red-600';
          borderColor = 'border-red-600';
          icon = faCar;
        } else if (type.startsWith('c')) {
          iconColor = 'text-yellow-600';
          borderColor = 'border-yellow-600';
          icon = faBell;
        }

        const isSelected = selectedReport?.reportId === report.reportId;

        return (
          <Marker
            key={report.reportId}
            longitude={report.longitude}
            latitude={report.latitude}
          >
            <div
              onClick={() =>
                setSelectedReport(isSelected ? null : report)
              }
              className="cursor-pointer"
            >
              {isSelected ? (
                <img
                  src={report.img || '/placeholder.jpg'}
                  alt="Report"
                  className={`rounded-md border-2 ${borderColor} shadow-lg`}
                  style={{
                    width: `${getScaledSize(zoom, 15, 80, 200)}px`,
                    height: `${getScaledSize(zoom, 15, 80, 200)}px`,
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <MapIcon
                  icon={icon}
                  className={`${iconColor}`}
                  style={{
                    fontSize: `${getScaledSize(zoom, 2, 16, 48)}px`,
                  }}
                />
              )}
            </div>
          </Marker>
        );
      })}
    </>
  );
};

export default ReportMarkers;