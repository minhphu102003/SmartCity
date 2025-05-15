import { Source, Layer } from 'react-map-gl';

const defaultGetRouteLineStyle = () => ({
  'line-color': '#007AFF',
  'line-width': 4,
  'line-opacity': 0.8,
});


const RouteLayers = ({ geoJsonRoutes, getRouteLineStyle = defaultGetRouteLineStyle }) => {
  return (
    <>
      {geoJsonRoutes?.length > 0 &&
        geoJsonRoutes.map((route, index) => (
          <Source
            key={index}
            id={`route-${index}`}
            type="geojson"
            data={route}
          >
            <Layer
              id={`route-line-${index}`}
              type="line"
              paint={getRouteLineStyle(route, index, geoJsonRoutes)}
            />
          </Source>
        ))}
    </>
  );
};

export default RouteLayers;
