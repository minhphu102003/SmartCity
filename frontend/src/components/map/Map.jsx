import React, { useEffect, useState } from 'react';
import polyline from '@mapbox/polyline';
import ReactMapGL, {
  GeolocateControl,
  FullscreenControl,
  NavigationControl,
  Marker,
  Source,
  Layer,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faCar,
  faBicycle,
  faBus,
  faMapMarkerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

// Import các component
import SearchBar from '../searchBar/SearchBar';
import ScrollableButtons from '../scrollableButtons/ScrollableButtons';
import FindRoutes from '../route/FindRoutes';
import { fetchRoutes } from '../../services/route'; // Import hàm gọi API

const Map = () => {
  const [viewport, setViewport] = useState({
    latitude: 16.775719836981914,
    longitude: 107.3362579278762,
    zoom: 16,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [buttonsData, setButtonsData] = useState([]);
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [routes, setRoutes] = useState([]); // Lưu tuyến đường lấy từ API
  const [geoJsonRoutes, setGeoJsonRoutes] = useState([]);

  useEffect(() => {
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

  // Theo dõi khi cả startMarker và endMarker có giá trị để tự động gọi API tìm đường
  useEffect(() => {
    if (startMarker && endMarker) {
      const start = `${startMarker.longitude},${startMarker.latitude}`;
      const end = `${endMarker.longitude},${endMarker.latitude}`;

      const getRoutes = async () => {
        try {
          const response = await fetchRoutes(start, end);
          console.log('Danh sách tuyến đường:', response.data.routes);
          setRoutes(response?.data?.routes); // Lưu danh sách tuyến đường gốc

          // Chuyển đổi dữ liệu geometry thành GeoJSON
          const geoJsonData = response.data.routes.map((route) => {
            const decodedCoordinates = polyline.decode(route.geometry); // Giải mã geometry
            console.log('recommended', route.recommended);
            return {
              type: 'Feature',
              properties: {
                recommended: route.recommended, // Thêm thông tin có phải tuyến đề xuất không
              },
              geometry: {
                type: 'LineString',
                coordinates: decodedCoordinates.map((coord) => [
                  coord[1],
                  coord[0],
                ]), // Đảo ngược tọa độ để phù hợp với GeoJSON
              },
            };
          });

          setGeoJsonRoutes(geoJsonData); // Cập nhật tuyến đường dạng GeoJSON
        } catch (error) {
          console.error('Lỗi khi gọi API tìm đường:', error);
        }
      };

      getRoutes();
    }
  }, [startMarker, endMarker]);


  const handleGeolocate = (event) => {
    const { latitude, longitude } = event.coords;
    setViewport({ latitude, longitude, zoom: 16 });
    setUserLocation({ latitude, longitude });
  };

  const handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;

    if (focusedInput === 'start') {
      setStartMarker({ longitude: lng, latitude: lat });
    } else if (focusedInput === 'end') {
      setEndMarker({ longitude: lng, latitude: lat });
    }
  };

  const handleInputFocus = (inputType) => {
    setFocusedInput(inputType);
  };

  const handleRouteClick = () => {
    setIsRouteVisible(true);
  };

  const handleCloseRoute = () => {
    setIsRouteVisible(false);
    setStartMarker(null);
    setEndMarker(null);
    setUserLocation(null);
    setRoutes([]); // Xóa tuyến đường khi đóng FindRoutes
    setGeoJsonRoutes([]);
  };

  const handleSelectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          setViewport({ latitude, longitude, zoom: 16 });
        },
        (error) => {
          console.error('Lỗi lấy vị trí:', error);
        }
      );
    } else {
      console.error('Trình duyệt không hỗ trợ Geolocation');
    }
  };

  return (
    <div className="relative h-screen w-full">
      <AnimatePresence>
        {!isRouteVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute left-[2%] top-4 z-50 flex w-[92%] items-center gap-4"
          >
            <SearchBar onRouteClick={handleRouteClick} />
            <ScrollableButtons data={buttonsData} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRouteVisible && (
          <FindRoutes
            onClose={handleCloseRoute}
            onSelectLocation={handleSelectLocation}
            userLocation={userLocation}
            onInputFocus={handleInputFocus}
            startMarker={startMarker}
            endMarker={endMarker}
            routes={routes} // Truyền danh sách tuyến đường xuống FindRoutes
          />
        )}
      </AnimatePresence>

      <ReactMapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        transitionDuration={200}
        onMove={(evt) => setViewport(evt.viewState)}
        onClick={handleMapClick}
      >
{geoJsonRoutes.map((route, index) => {
  // Tìm tuyến đề xuất đầu tiên
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
              ? '#1f618d' // Màu vàng cho tuyến đề xuất đầu tiên
              : route.properties.recommended
              ? '#3498db' // Màu xanh dương cho các tuyến đề xuất khác
              : '#FF0000', // Màu đỏ cho tuyến không đề xuất
          'line-width':
            route.properties.recommended && index === firstRecommendedIndex
              ? 6 // Độ dày lớn hơn cho tuyến đề xuất đầu tiên
              : 5,
          'line-opacity':
            route.properties.recommended && index === firstRecommendedIndex
              ? 1 // Độ đậm hơn cho tuyến đầu tiên
              : 0.8,
        }}
      />
    </Source>
  );
})}


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

        <GeolocateControl
          style={{ top: 10, left: 10 }}
          trackUserLocation={true}
          onGeolocate={handleGeolocate}
        />
        <FullscreenControl />
        <NavigationControl />
      </ReactMapGL>
    </div>
  );
};

export default Map;
