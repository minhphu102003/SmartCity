import { Source, Layer } from 'react-map-gl';

const congestionLayerStyle = {
  id: 'congestion-points',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#FF0000',
    'circle-opacity': 0.5,
    'circle-stroke-color': '#FFAAAA',
    'circle-stroke-width': 8,
  },
};

const defaultGetRouteLineStyle = (route, index, routes) => {
  const isRecommended = route.properties?.recommended;

  return {
    'line-color': isRecommended ? '#1E90FF' : '#87CEFA',
    'line-width': 5,
    'line-opacity': 0.8,
  };
};

const RouteLayers = ({ geoJsonRoutes, congestionPoints = [], getRouteLineStyle = defaultGetRouteLineStyle }) => {
  const congestionGeoJson = {
    type: 'FeatureCollection',
    features: congestionPoints.map((point, index) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [point[0], point[1]],
      },
      properties: {
        id: index,
        type: point.type,
        timestamp: point.timestamp,
        typeReport: point.typeReport,
      },
    })),
  };

  const nonRecommendedRoutes = geoJsonRoutes.filter(route => !route.properties?.recommended);
  const recommendedRoutes = geoJsonRoutes.filter(route => route.properties?.recommended);

  return (
    <>
      {nonRecommendedRoutes.map((route, index) => (
        <Source key={`nonrec-${index}`} id={`nonrec-${index}`} type="geojson" data={route}>
          <Layer
            id={`route-line-nonrec-${index}`}
            type="line"
            paint={getRouteLineStyle(route, index, geoJsonRoutes)}
          />
        </Source>
      ))}

      {recommendedRoutes.map((route, index) => (
        <Source key={`rec-${index}`} id={`rec-${index}`} type="geojson" data={route}>
          <Layer
            id={`route-line-rec-${index}`}
            type="line"
            paint={getRouteLineStyle(route, index, geoJsonRoutes)}
          />
        </Source>
      ))}

      {congestionPoints.length > 0 && (
        <Source id="congestion-points" type="geojson" data={congestionGeoJson}>
          <Layer {...congestionLayerStyle} />
        </Source>
      )}
    </>
  );
};

export default RouteLayers;
