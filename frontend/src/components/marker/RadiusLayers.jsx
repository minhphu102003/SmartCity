import { Source, Layer } from "react-map-gl";

const RadiusLayers = ({ geojsonData, reports }) => {
  if (!geojsonData || geojsonData.length === 0) return null;

  return (
    <>
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

export default RadiusLayers;