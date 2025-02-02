import React, { useEffect, useState } from 'react';
import ReactMapGL, {
  GeolocateControl,
  FullscreenControl,
  NavigationControl,
  Marker,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const Map = () => {
  const [viewport, setViewport] = useState({
    latitude: 16.775719836981914,
    longitude: 107.3362579278762,
    zoom: 16,
  });

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Lấy vị trí người dùng khi component mount
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position) =>{
        const {latitude, longitude} = position.coords;
        setViewport({
          latitude,
          longitude,
          zoom: 16,
        });
        setUserLocation({latitude, longitude});
      },
      (error) => {
        console.warn("Không thể lấy vị trí người dùng, sử dụng vị trí mặc định", error);
      })
    }else {
      console.warn("Trình duyệt không hỗ trợ geolocation");
    }
  }, []);

  const handleGeolocate = (event) => {
    const {latitude, longitude} = event.coords;
    setViewport({
      latitude,
      longitude,
      zoom: 16,
    });
    setUserLocation({latitude, longitude});
  }

  return (
    <div className="h-full w-full">
      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        transitionDuration={200}
        onMove={(evt) => setViewport(evt.viewState)}
      >
        {userLocation && (
          <Marker longitude={userLocation.longitude} latitude={userLocation.latitude}>
            <FontAwesomeIcon
              icon={faLocationDot}
              style={{color: '#388716', fontSize: '30px'}}
            />
          </Marker>
        )}
        <GeolocateControl 
          style={{top: 10, left: 10}} // tùy chỉnh vị trí của control
          positionOptions={{enableHighAccuracy: true}} // Cải thiện độ chính xác
          trackUserLocation={true} // Theo dõi vị trí người dùng
          onGeolocate={handleGeolocate} // Cập nhật vị trí khi lấy được
        />
        <FullscreenControl />
        <NavigationControl />
      </ReactMapGL>
    </div>
  );
};

export default Map;
