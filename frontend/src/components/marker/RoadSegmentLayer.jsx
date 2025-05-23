import { Source, Layer } from 'react-map-gl';

const RoadSegmentLayer = ({ roadSegments, hoveredId, selectedSegmentId }) => {
  if (!roadSegments || roadSegments.length === 0) return null;

  const geojson = {
    type: "FeatureCollection",
    features: roadSegments.map((segment) => ({
      type: "Feature",
      geometry: segment.roadSegmentLine,
      properties: {
        id: segment._id,
        name: segment.roadName,
        groundwater: segment.groundwater_level,
      },
    })),
  };

  return (
    <Source id="road-segments" type="geojson" data={geojson}>
      <Layer
        id="road-segment-layer"
        type="line"
        paint={{
          "line-color": "#FFA500",
          "line-width": 4,
        }}
      />

      {selectedSegmentId && (
        <Layer
          id="road-segment-selected"
          type="line"
          paint={{
            "line-color": "#FF0000",
            "line-width": 8,
            "line-cap": "round",
          }}
          filter={["==", ["get", "id"], selectedSegmentId]}
        />
      )}

      {hoveredId && (
        <Layer
          id="road-segment-hovered"
          type="line"
          paint={{
            "line-color": "#ffff00",
            "line-width": 6,
            "line-cap": "round",
          }}
          filter={["==", ["get", "id"], hoveredId]}
        />
      )}
    </Source>
  );
};

export default RoadSegmentLayer;
