import React, { useEffect, useState } from 'react';
import { Marker, Source, Layer } from 'react-map-gl';
import {
  faLocationDot,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import MapIcon from '../icons/MapIcon';
import { faCar, faWater } from '@fortawesome/free-solid-svg-icons';
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
  const [geojsonData, setGeojsonData] = useState([]);

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
        reports.map((report) => {
          const isTrafficJam = report.typeReport.toLowerCase().startsWith('t');
          const iconColor = isTrafficJam ? 'text-red-600' : 'text-blue-600';
          const borderColor = isTrafficJam
            ? 'border-red-500'
            : 'border-blue-500';

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
                      width: '150px',
                      height: '150px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <MapIcon
                    icon={isTrafficJam ? faCar : faWater}
                    className={`text-xl ${iconColor}`}
                  />
                )}
              </div>
            </Marker>
          );
        })}

      {geojsonData.map((geo, index) => {
        const isTrafficJam = reports[index]?.typeReport
          .toLowerCase()
          .startsWith('t');
        const fillColor = isTrafficJam
          ? 'rgba(255, 0, 0, 0.3)'
          : 'rgba(0, 0, 255, 0.3)';

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
