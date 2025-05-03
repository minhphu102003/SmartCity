import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';

import { MAP_STYLE, MAP_BOX_API, DEFAULT_VIEWPORT } from '../../constants';

const getCircleGeoJSON = (longitude, latitude, radiusInKm = 0.1) => {
  const center = turf.point([longitude, latitude]);
  const options = { steps: 64, units: 'kilometers' };
  const circle = turf.circle(center, radiusInKm, options);

  return circle;
};

const ReportMap = ({ points }) => {
  const [viewport, setViewport] = useState(DEFAULT_VIEWPORT);

  const [selectedPoint, setSelectedPoint] = useState(null);
  const [geojsonData, setGeojsonData] = useState([]);

  useEffect(() => {
    const newGeoJSON = points.map((point) => {
      const circle = getCircleGeoJSON(point.lng, point.lat, 0.1);
      return {
        id: `radius-${point.timestamp}`,
        data: circle,
        type: point.type,
        lng: point.lng,
        lat: point.lat,
      };
    });
    setGeojsonData(newGeoJSON);
  }, [points]);

  return (
    <div className="mt-6 h-[400px] w-full overflow-hidden rounded-xl bg-gray-800 shadow-lg">
      <ReactMapGL
        {...viewport}
        onMove={(evt) => setViewport(evt.viewState)}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAP_BOX_API}
        width="100%"
        height="100%"
      >
        {selectedPoint && (
          <Popup
            longitude={selectedPoint.lng}
            latitude={selectedPoint.lat}
            anchor="top"
            onClose={() => setSelectedPoint(null)}
            closeOnClick={false}
          >
            <div className="text-sm text-black">
              <p>
                <strong>Type:</strong> {selectedPoint.type}
              </p>
              <p>
                <strong>Time:</strong>{' '}
                {new Date(selectedPoint.timestamp).toLocaleString()}
              </p>
              <p>
                <strong>Lat:</strong> {selectedPoint.lat.toFixed(5)}
              </p>
              <p>
                <strong>Lng:</strong> {selectedPoint.lng.toFixed(5)}
              </p>
            </div>
          </Popup>
        )}

        {geojsonData.map((geo, idx) => {
          const [longitude, latitude] = geo.data.geometry.coordinates;
          console.log(geo.pointsInRadius); // Kiểm tra dữ liệu pointsInRadius
          console.log(longitude, latitude); // Kiểm tra tọa độ

          return (
            <Source key={geo.id} type="geojson" data={geo.data}>
              <Layer
                id={`circle-${idx}`}
                type="fill"
                paint={{
                  'fill-color':
                    geo.pointsInRadius && geo.pointsInRadius.length > 5
                      ? 'rgba(255, 0, 0, 0.4)' // Red color with 40% opacity
                      : 'rgba(255, 0, 0, 0.3)', // Red color with 30% opacity
                  'fill-opacity': 0.6,
                }}
              />
              {geo.pointsInRadius && geo.pointsInRadius.length >= 1 && (
                <Marker
                  longitude={longitude}
                  latitude={latitude}
                  onClick={() => {
                    console.log('Marker clicked!'); // Kiểm tra khi click
                    setSelectedPoint(geo);
                  }}
                >
                  <div className="rounded-full bg-gray-800 p-1 text-xs text-white">
                    {geo.pointsInRadius.length}
                  </div>
                </Marker>
              )}
            </Source>
          );
        })}
      </ReactMapGL>
    </div>
  );
};

export default ReportMap;
