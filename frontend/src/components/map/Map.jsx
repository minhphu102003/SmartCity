import React, { useEffect, useState } from 'react';
import ReactMapGL, { GeolocateControl, FullscreenControl, NavigationControl, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faCar, faBicycle, faBus } from '@fortawesome/free-solid-svg-icons';

// Import các component
import SearchBar from '../searchBar/SearchBar';
import ScrollableButtons from '../scrollableButtons/ScrollableButtons';

const Map = () => {
  const [viewport, setViewport] = useState({
    latitude: 16.775719836981914,
    longitude: 107.3362579278762,
    zoom: 16,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [buttonsData, setButtonsData] = useState([]);

  useEffect(() => {
    // Giả lập dữ liệu từ API backend
    const fetchData = async () => {
      const dataFromAPI = [
        { name: 'Ô tô', icon: faCar },
        { name: 'Xe máy', icon: faBicycle },
        { name: 'Xe bus', icon: faBus },
        { name: 'Taxi VIP', icon: faCar },
        { name: 'Đưa đón sân bay', icon: faCar },
      ];
      setButtonsData(dataFromAPI);
    };

    fetchData();
  }, []);

  const handleGeolocate = (event) => {
    const { latitude, longitude } = event.coords;
    setViewport({ latitude, longitude, zoom: 16 });
    setUserLocation({ latitude, longitude });
  };

  return (
    <div className="relative h-screen w-full">
      {/* Thanh tìm kiếm + Nút cuộn */}
      <div className="absolute left-[2%] top-4 z-50 flex w-[92%] items-center gap-4">
        <SearchBar />
        <ScrollableButtons data={buttonsData} />
      </div>

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
            <FontAwesomeIcon icon={faLocationDot} style={{ color: '#388716', fontSize: '30px' }} />
          </Marker>
        )}
        <GeolocateControl style={{ top: 10, left: 10 }} trackUserLocation={true} onGeolocate={handleGeolocate} />
        <FullscreenControl />
        <NavigationControl />
      </ReactMapGL>
    </div>
  );
};

export default Map;
