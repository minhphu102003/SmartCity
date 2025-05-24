import React, { useEffect, useState, useContext } from 'react';
import { Marker, Source, Layer } from 'react-map-gl';
import {
  faLocationDot,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import MapIcon from '../icons/MapIcon';
import PlacesMarkers from './PlacesMarkers';
import CameraMarker from './CameraMarker';
import RoadSegmentLayer from './RoadSegmentLayer';
import ReportMarkers from './ReportMarkers';
import RadiusLayers from './RadiusLayers';
import { CameraPopup, EditRoadSegmentPopup } from '../popup';
import { getCircleGeoJSON } from "../../utils/geoUtils";
import { updateRoadSegment } from '../../services/roadSegment';
import { recalculateGroundwaterLevel } from '../../utils/normalized';
import MethodContext from '../../context/methodProvider';
import buffer from '@turf/buffer';
import { lineString } from '@turf/helpers';

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
  roadSegments,
  hoveredId,
  selectedSegmentId,
  setSelectedSegmentId,
  predictions,
}) => {
  const [geojsonData, setGeojsonData] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [editingSegmentData, setEditingSegmentData] = useState({
    id: null,
    roadName: '',
    raiseHeight: '',
  });

  const { notify } = useContext(MethodContext);


  useEffect(() => {
    const newGeoJSON = reports.map((report) => ({
      id: `radius-${report.reportId}`,
      data: getCircleGeoJSON(report.longitude, report.latitude),
    }));
    setGeojsonData(newGeoJSON);
  }, [reports]);

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

      {predictions.map((predict) => {
        const lineCoords = predict.coordinates.map(({ lng, lat }) => [lng, lat]);
        const lineFeature = lineString(lineCoords);
        const buffered = buffer(lineFeature, 0.0002, { units: 'degrees' });

        return (
          <React.Fragment key={predict.id}>

            <Source type="geojson" data={buffered}>
              <Layer
                id={`buffer-${predict.id}`}
                type="fill"
                paint={{
                  'fill-color': '#FFA500',
                  'fill-opacity': 0.5,
                }}
              />
            </Source>

            <Source
              type="geojson"
              data={{
                type: 'Feature',
                geometry: {
                  type: 'LineString',
                  coordinates: lineCoords,
                },
              }}
            >
              <Layer
                id={`prediction-line-${predict.id}`}
                type="line"
                paint={{
                  'line-color': '#FFA500',
                  'line-width': 4,
                  'line-dasharray': [2, 2],
                }}
              />
            </Source>
          </React.Fragment>
        );
      })}

      <RoadSegmentLayer roadSegments={roadSegments} hoveredId={hoveredId} />

      {selectedSegmentId && (() => {
        const segment = roadSegments.find(s => s._id === selectedSegmentId);
        if (!segment) return null;

        const handleSave = async () => {
          if (!segment) return;

          const updatedRoadName = editingSegmentData.roadName;
          const raiseHeight = parseFloat(editingSegmentData.raiseHeight);

          const nearRiver = segment.near_river;

          const newGroundwaterLevel = recalculateGroundwaterLevel(nearRiver, raiseHeight);

          const updateData = {
            roadName: updatedRoadName,
            groundwater_level: newGroundwaterLevel,
          };

          try {
            await updateRoadSegment(segment._id, updateData);

            notify('Updated road segment successfully', 'success');
          } catch (error) {
            notify('Updated road segment failure', 'fail');
          }

          setSelectedSegmentId(null);
          setEditingSegmentData({ id: null, roadName: '', raiseHeight: '' });
        };

        return (
          <EditRoadSegmentPopup
            segment={segment}
            editingData={editingSegmentData}
            setEditingData={setEditingSegmentData}
            onSave={handleSave}
            onClose={() => setSelectedSegmentId(null)}
          />
        );
      })()}


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

      <CameraPopup
        camera={selectedCamera}
        onClose={() => setSelectedCamera(null)}
      />

      <ReportMarkers
        reports={reports}
        selectedReport={selectedReport}
        setSelectedReport={setSelectedReport}
        zoom={zoom}
      />

      <RadiusLayers
        geojsonData={geojsonData}
        reports={reports}
      />
    </>
  );
};

export default MapMarkers;
