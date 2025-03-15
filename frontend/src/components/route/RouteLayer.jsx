import React from 'react';
import { Source, Layer } from 'react-map-gl';

const RouteLayer = ({ geoJsonRoutes }) => {
  return geoJsonRoutes.map((route, index) => {
    const firstRecommendedIndex = geoJsonRoutes.findIndex(
      (r) => r.properties.recommended
    );

    return (
      <Source key={index} id={`route-${index}`} type="geojson" data={route}>
        <Layer
          id={`route-line-${index}`}
          type="line"
          paint={{
            'line-color':
              route.properties.recommended && index === firstRecommendedIndex
                ? '#1f618d'
                : '#FF0000',
            'line-width':
              route.properties.recommended && index === firstRecommendedIndex
                ? 6
                : 5,
            'line-opacity': route.properties.recommended ? 1 : 0.8,
          }}
        />
      </Source>
    );
  });
};

export default RouteLayer;
