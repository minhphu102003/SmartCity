import React from 'react';
import { Marker } from 'react-map-gl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';

const Markers = ({ userLocation, startMarker, endMarker }) => {
  return (
    <>
      {userLocation && (
        <Marker
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
        >
          <FontAwesomeIcon
            icon={faLocationDot}
            style={{ color: '#388716', fontSize: '30px' }}
          />
        </Marker>
      )}
      {startMarker && (
        <Marker
          longitude={startMarker.longitude}
          latitude={startMarker.latitude}
        >
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            style={{ color: 'blue', fontSize: '30px' }}
          />
        </Marker>
      )}
      {endMarker && (
        <Marker longitude={endMarker.longitude} latitude={endMarker.latitude}>
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            style={{ color: 'red', fontSize: '30px' }}
          />
        </Marker>
      )}
    </>
  );
};

export default Markers;
