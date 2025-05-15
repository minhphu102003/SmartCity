import { useEffect, useState, useRef } from 'react';
import { Marker, Source, Layer, Popup } from 'react-map-gl';
import {
  faLocationDot,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import MapIcon from '../icons/MapIcon';
import { faCar, faWater, faBell } from '@fortawesome/free-solid-svg-icons';
import PlacesMarkers from './PlacesMarkers';
import * as turf from '@turf/turf';
import CameraMarker from './CameraMarker';

const MapMarkers = ({
  userLocation,
  startMarker,
  endMarker,
  places,
  reports,
  cameras,
  selectedReport,
  setSelectedReport,
  zoom,
}) => {
  const [geojsonData, setGeojsonData] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setSelectedCamera(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const newGeoJSON = reports.map((report) => ({
      id: `radius-${report.timestamp}`,
      data: getCircleGeoJSON(report.longitude, report.latitude),
    }));
    setGeojsonData(newGeoJSON);
  }, [reports]);

  const getCircleGeoJSON = (longitude, latitude, radiusInKm = 0.1) => {
    const center = turf.point([longitude, latitude]);
    const radius = radiusInKm;
    const options = { steps: 64, units: 'kilometers' };
    const circle = turf.circle(center, radius, options);
    return circle;
  };

  const getScaledSize = (zoom, base = 14, min = 24, max = 60) => {
    return Math.max(min, Math.min(max, base * zoom));
  };

  return (
    <>
      {userLocation && (
        <Marker
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
        >
          <MapIcon icon={faLocationDot} className="text-3xl text-green-600" />
        </Marker>
      )}

      {startMarker && (
        <Marker
          longitude={startMarker.longitude}
          latitude={startMarker.latitude}
        >
          <MapIcon icon={faMapMarkerAlt} className="text-3xl text-blue-500" />
        </Marker>
      )}

      {endMarker && (
        <Marker longitude={endMarker.longitude} latitude={endMarker.latitude}>
          <MapIcon icon={faMapMarkerAlt} className="text-3xl text-red-500" />
        </Marker>
      )}

      {places && <PlacesMarkers places={places} />}

      {cameras?.length > 0 &&
        cameras.map((camera, index) => (
          <CameraMarker
            key={`camera-${index}`}
            camera={camera}
            zoom={zoom}
            onSelect={setSelectedCamera}
          />
        ))
      }

      {selectedCamera && (
        <Popup
          longitude={selectedCamera.longitude}
          latitude={selectedCamera.latitude}
          closeOnClick={false}
          onClose={() => setSelectedCamera(null)}
          offset={[0, -20]}
        >
          <div ref={popupRef} className="w-[300px] h-[200px] relative">
            <button
              onClick={() => setSelectedCamera(null)}
              className="absolute top-1 right-1 text-gray-600 hover:text-red-500 font-bold z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
              aria-label="Close popup"
            >
              ×
            </button>
            <iframe
              src={`${selectedCamera.link.replace('watch?v=', 'embed/')}?autoplay=1`}
              title="Camera Video"
              allow="autoplay"
              allowFullScreen
              className="w-full h-full rounded-md"
            />
          </div>
        </Popup>
      )}

      {reports.length > 0 &&
        reports.map((report) => {
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

          return (
            <Marker
              key={report.timestamp}
              longitude={report.longitude}
              latitude={report.latitude}
            >
              <div
                onClick={() =>
                  setSelectedReport(
                    selectedReport?.timestamp === report.timestamp
                      ? null
                      : report
                  )
                }
                className="cursor-pointer"
              >
                {selectedReport?.timestamp === report.timestamp ? (
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

      {geojsonData.map((geo, index) => {
        const type = reports[index]?.typeReport?.toLowerCase() || '';
        let fillColor = 'rgba(0, 0, 255, 0.3)';
        if (type.startsWith('t')) {
          fillColor = 'rgba(255, 0, 0, 0.3)';
        } else if (type.startsWith('c')) {
          fillColor = 'rgba(255, 255, 0, 0.3)';
        }

        return (
          <Source key={geo.id} id={geo.id} type="geojson" data={geo.data}>
            <Layer
              id={geo.id}
              type="fill"
              paint={{
                'fill-color': fillColor,
                'fill-opacity': 0.5,
              }}
            />
          </Source>
        );
      })}
    </>
  );
};

export default MapMarkers;
