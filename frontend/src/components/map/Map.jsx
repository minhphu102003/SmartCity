import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import ReactMapGL, { GeolocateControl, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AnimatePresence } from 'framer-motion';
import useRoutes from '../../hooks/useRoutes';
import { MAP_STYLE, MAP_BOX_API } from '../../constants';
import { getUserLocation } from '../../utils/mapUtils';
import 'react-toastify/dist/ReactToastify.css';
import WeatherModal from '../modals/WeatherModal';
import MapMarkers from '../marker/MapMarkers';
import ContextMenu from '../menu/ContextMenu';
import NotificationPopup from '../popup/NotificationPopup';
import { TopControls } from '../controlMap';
import { RouteLayers, RouteModal } from '../route';
import { useFloodData } from '../../hooks/useFloodData';
import { useMapHandlers } from '../../hooks/useMapHandlers';
import { useMapViewport } from '../../hooks/useMapViewport';
import { useWeatherModal } from '../../hooks/useWeatherModal';
import { useNavigationToast } from '../../hooks/useNavigationToast';
import { useLocationSelector } from '../../hooks/useLocationSelector';
import { CameraModal } from '../modal';
import { createCamera } from '../../services/camera';
import MethodProvider from '../../context/methodProvider';
import { getRoadSegments } from '../../services/roadSegment';

const MapLoadingOverlay = () => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 pointer-events-none">
    <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-opacity-75" />
  </div>
);

const Map = ({ isAuth = false }) => {
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const [startMarker, setStartMarker] = useState(null);
  const [endMarker, setEndMarker] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const [places, setPlaces] = useState([]);
  const [roadSegment, setRoadSegment] = useState([]);
  const mapRef = useRef(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [visibleRoadSegment, setVisibleRoadSegment] = useState(null);
  const [cameraFormLocation, setCameraFormLocation] = useState(null);
  const [isLoadingSegment, setIsLoadingSegment] = useState(false);
  const { notify } = useContext(MethodProvider);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState(null);

  const onHover = useCallback((event) => {
    const feature = event.features?.[0];
    setHoveredId(feature?.properties?.id || null);
  }, []);

  const {
    viewport,
    setViewport,
    zoom,
    userLocation,
    setUserLocation,
    handleViewportChange,
    handleGeolocate,
  } = useMapViewport();

  const { cameras, reports, shouldShake, latestMessage, predictions,  refetchCameras } =
    useFloodData(userLocation);

  const {
    notificationPopup,
    handleCreateNotification,
    handleSubmitNotification,
    setNotificationPopup,
  } = useMapHandlers(contextMenu);

  useNavigationToast();
  const { handleSelectLocation } = useLocationSelector(
    setStartMarker,
    setEndMarker,
    setUserLocation,
    mapRef,
    setViewport,
    focusedInput
  );

  useEffect(() => {
    getUserLocation(setUserLocation, setViewport);
  }, []);

  const handleToggleRoadSegment = async (longitude, latitude) => {
    const mapContainer = mapRef?.current?.getMap()?.getContainer();

    if (
      visibleRoadSegment &&
      visibleRoadSegment.longitude === longitude &&
      visibleRoadSegment.latitude === latitude
    ) {
      setVisibleRoadSegment(null);
      setRoadSegment([]);
    } else {
      setIsLoadingSegment(true);

      if (mapContainer) mapContainer.style.cursor = "progress";

      try {
        const data = await getRoadSegments({ longitude, latitude });
        setRoadSegment(data?.data);
        setVisibleRoadSegment({ longitude, latitude, data });
      } catch (error) {
        console.error("Failed to fetch road segments:", error);
      } finally {
        setIsLoadingSegment(false);
        if (mapContainer) mapContainer.style.cursor = "default";
      }
    }
  };

  const { isWeatherModalOpen, setIsWeatherModalOpen, weatherData } =
    useWeatherModal(userLocation);

  const { routes, geoJsonRoutes, congestionPoints, resetRoutes } = useRoutes(
    startMarker,
    endMarker
  );

  const handleCreateCamera = (longitude, latitude) => {
    setCameraFormLocation({ longitude, latitude });
  };

  const handleCameraFormSubmit = async (payload) => {
    try {
      const res = await createCamera(payload);
      if (res?.success) {
        notify('Create camera successfully!', 'success');
        await refetchCameras();
        setCameraFormLocation(null);
      } else {
        notify('Create camera failure!', 'fail');
      }
    } catch (err) {
      notify('Create camera failure!', 'fail');
    }
  };

  return (
    <div className="relative h-full w-full">
      {isWeatherModalOpen && weatherData && !isAuth && (
        <WeatherModal
          onClose={() => setIsWeatherModalOpen(false)}
          weather={weatherData}
        />
      )}

      <AnimatePresence>
        {!isRouteVisible && (
          <TopControls
            isAuth={isAuth}
            userLocation={userLocation}
            shouldShake={shouldShake}
            latestMessage={latestMessage}
            setIsRouteVisible={setIsRouteVisible}
            handleSelectLocation={handleSelectLocation}
            setPlaces={setPlaces}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isRouteVisible && (
          <RouteModal
            setIsRouteVisible={setIsRouteVisible}
            setStartMarker={setStartMarker}
            setEndMarker={setEndMarker}
            setUserLocation={setUserLocation}
            resetRoutes={resetRoutes}
            handleSelectLocation={handleSelectLocation}
            getUserLocation={getUserLocation}
            setViewport={setViewport}
            userLocation={userLocation}
            setFocusedInput={setFocusedInput}
            startMarker={startMarker}
            endMarker={endMarker}
            routes={routes}
          />
        )}
      </AnimatePresence>

      <ReactMapGL
        {...viewport}
        ref={mapRef}
        width="100%"
        height="100%"
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAP_BOX_API}
        transitionDuration={200}
        onMove={handleViewportChange}
        interactiveLayerIds={['road-segment-layer']}
        onMouseMove={onHover}
        onClick={(event) => {
          const { lng, lat } = event.lngLat;
          if (focusedInput === 'start') {
            setStartMarker({ longitude: lng, latitude: lat });
          } else if (focusedInput === 'end') {
            setEndMarker({ longitude: lng, latitude: lat });
          }

          const features = event.features || [];
          const roadSegmentFeature = features.find(f => f.layer.id === 'road-segment-layer');

          if (roadSegmentFeature) {
            const clickedId = roadSegmentFeature.properties.id;
            setSelectedSegmentId(prev => prev === clickedId ? null : clickedId); // toggle selection
            return;
          }

        }}
        onContextMenu={(event) => {
          event.preventDefault();
          if (!isAuth) return;
          const { lng, lat } = event.lngLat;
          setContextMenu({
            x: event.point.x,
            y: event.point.y,
            longitude: lng,
            latitude: lat,
          });
        }}

      >
        {contextMenu && (
          <ContextMenu
            contextMenu={contextMenu}
            onToggleRoadSegment={handleToggleRoadSegment}
            onCreateCamera={handleCreateCamera}
            onCreateNotification={handleCreateNotification}
            isRoadSegmentVisible={
              visibleRoadSegment &&
              visibleRoadSegment.latitude === contextMenu.latitude &&
              visibleRoadSegment.longitude === contextMenu.longitude
            }
            onClose={() => {
              setContextMenu(null);
              setRoadSegment([]);
            }}
          />
        )}

        {cameraFormLocation && (
          <CameraModal
            initialData={{
              latitude: cameraFormLocation.latitude,
              longitude: cameraFormLocation.longitude,
            }}
            onClose={() => setCameraFormLocation(null)}
            onSubmit={handleCameraFormSubmit}
            mode="create"
          />
        )}

        {notificationPopup && (
          <NotificationPopup
            x={notificationPopup.x}
            y={notificationPopup.y}
            longitude={notificationPopup.longitude}
            latitude={notificationPopup.latitude}
            onClose={() => setNotificationPopup(null)}
            onSubmit={handleSubmitNotification}
          />
        )}

        <RouteLayers geoJsonRoutes={geoJsonRoutes} congestionPoints={congestionPoints} />

        <MapMarkers
          userLocation={userLocation}
          startMarker={startMarker}
          endMarker={endMarker}
          places={places}
          reports={reports}
          cameras={cameras}
          roadSegments={roadSegment}
          hoveredId={hoveredId}
          selectedSegmentId={selectedSegmentId}
          setSelectedSegmentId={setSelectedSegmentId}
          selectedReport={selectedReport}
          setSelectedReport={setSelectedReport}
          zoom={zoom}
          predictions={predictions}
        />

        <NavigationControl position="bottom-right" />
        <GeolocateControl
          position="bottom-right"
          trackUserLocation={true}
          onGeolocate={handleGeolocate}
        />
      </ReactMapGL>

      {isLoadingSegment && <MapLoadingOverlay />}
    </div>
  );
};

export default Map;
