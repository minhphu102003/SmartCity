import React, { useEffect, useRef, useState } from 'react';
import ReactMapGL, {
  GeolocateControl,
  FullscreenControl,
  NavigationControl,
  Marker,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faSearch,
  faChevronRight,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

const Map = () => {
  const [viewport, setViewport] = useState({
    latitude: 16.775719836981914,
    longitude: 107.3362579278762,
    zoom: 16,
  });

  const [userLocation, setUserLocation] = useState(null);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setViewport({
            latitude,
            longitude,
            zoom: 16,
          });
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.warn(
            'Không thể lấy vị trí người dùng, sử dụng vị trí mặc định',
            error
          );
        }
      );
    } else {
      console.warn('Trình duyệt không hỗ trợ geolocation');
    }
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        setCanScrollLeft(scrollRef.current.scrollLeft > 0);
        
        // Kiểm tra nếu scroll đã đến hết bên phải (có độ trễ nhỏ do giá trị có thể bị làm tròn)
        setCanScrollRight(
          scrollRef.current.scrollLeft <
            scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 1
        );
      }
    };

    checkScroll();
    scrollRef.current?.addEventListener('scroll', checkScroll);

    return () => {
      scrollRef.current?.removeEventListener('scroll', checkScroll);
    };
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 100, behavior: 'smooth' });
    }
  };

  const handleGeolocate = (event) => {
    const { latitude, longitude } = event.coords;
    setViewport({
      latitude,
      longitude,
      zoom: 16,
    });
    setUserLocation({ latitude, longitude });
  };

  return (
    <div className="relative h-screen w-full">
      {/* Thanh tìm kiếm + Nút cuộn */}
      <div className="absolute left-[2%] top-4 z-50 flex w-[92%] items-center">
        <div className="gap-4 rounded-xl bg-white px-2 shadow-md">
          {/* Thanh tìm kiếm */}
          <div className="flex w-[30%] items-center gap-2 rounded-xl bg-white px-2 py-1">
            <input
              type="text"
              placeholder="Tìm kiếm địa điểm..."
              className="flex-1 px-4 py-2 outline-none"
            />
            <button className="flex h-[5vh] w-[40px] items-center justify-center rounded-lg px-2 text-black hover:bg-blue-600">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
        </div>

        {/* Danh sách nút */}
        <div className="relative ml-[4%] flex-1 overflow-hidden">
          {/* Nút cuộn trái */}
          {canScrollLeft && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-gray-300 p-2 shadow-md hover:bg-gray-400"
              onClick={() => handleScroll(-1)}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )}

          {/* Các nút cuộn */}
          <div
            ref={scrollRef}
            className="scrollbar-hide flex gap-3 overflow-x-auto whitespace-nowrap transition-all duration-300"
          >
            <button className="rounded-lg bg-green-500 px-4 py-2 text-white shadow-md hover:bg-green-600">
              Nút 1 Nút 1 Nút 1 Nút 1
            </button>
            <button className="rounded-lg bg-red-500 px-4 py-2 text-white shadow-md hover:bg-red-600">
              Nút 2 Nút 1 Nút 1
            </button>
            <button className="rounded-lg bg-blue-500 px-4 py-2 text-white shadow-md hover:bg-blue-600">
              Nút 3 Nút 1 Nút 1 Nút 1 Nút 1
            </button>
            <button className="rounded-lg bg-purple-500 px-4 py-2 text-white shadow-md hover:bg-purple-600">
              Nút 4 Nút 1 Nút 1 Nút 1 Nút 1
            </button>
            <button className="rounded-lg bg-orange-500 px-4 py-2 text-white shadow-md hover:bg-orange-600">
              Nút 5 Nút 1 Nút 1 Nút 1 Nút 1
            </button>
          </div>

          {/* Nút cuộn phải */}
          {canScrollRight && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-gray-300 px-2 py-1 shadow-md hover:bg-gray-400"
              onClick={() => handleScroll(1)}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          )}
        </div>
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
