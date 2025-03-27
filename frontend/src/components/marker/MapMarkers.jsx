import React from 'react';
import { Marker, Source, Layer } from 'react-map-gl';
import {
  faLocationDot,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import MapIcon from '../icons/MapIcon';
import PlacesMarkers from './PlacesMarkers';
import * as turf from '@turf/turf';

const MapMarkers = ({
  userLocation,
  startMarker,
  endMarker,
  places,
  reports,
  selectedReport,
  setSelectedReport,
  zoom,
}) => {
  const circleLayer = {
    id: 'circle-layer',
    type: 'fill',
    paint: {
      'fill-color': 'rgba(255, 0, 0, 0.3)',
      'fill-opacity': 0.5,
    },
  };

  const getCircleGeoJSON = (longitude, latitude, radiusInKm = 0.1) => {
    const center = turf.point([longitude, latitude]);
    const radius = radiusInKm; // Bán kính tính bằng km
    const options = { steps: 64, units: 'kilometers' };
    const circle = turf.circle(center, radius, options);
    return circle;
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

      {reports.length > 0 &&
        reports.map((report) => (
          <Marker
            key={report.reportId}
            longitude={report.longitude}
            latitude={report.latitude}
          >
            <div
              onClick={() => setSelectedReport(report)}
              className="cursor-pointer"
            >
              <img
                src={report.imgs[0].img || '/placeholder.jpg'}
                alt="Report"
                className="rounded-md border-2 border-red-500 shadow-lg"
                style={{
                  width: `${30 * Math.pow(1, 16 - zoom)}px`,
                  height: `${30 * Math.pow(1, 16 - zoom)}px`,
                }}
              />
            </div>
          </Marker>
        ))}

      {reports.length > 0 &&
        reports.map((report) => (
          <Source
            key={`radius-${report.reportId}`}
            id={`radius-${report.reportId}`}
            type="geojson"
            data={getCircleGeoJSON(report.longitude, report.latitude)}
          >
            <Layer {...circleLayer} />
          </Source>
        ))}
    </>
  );
};

export default MapMarkers;
