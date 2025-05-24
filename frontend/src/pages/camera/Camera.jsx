import React, { useState, useMemo } from 'react';
import CameraCard from '../../components/card/CameraCard';
import CameraHeader from '../../components/card/CameraHeader';
import useCameras from '../../hooks/useCameras';
import Loading from '../../components/common/Loading';
import ErrorComponent from '../../components/common/ErrorComponent';
import { CITIES } from '../../constants';
import CameraDetailModal from '../../components/modals/CameraDetailModal';

const Camera = () => {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCamera, setActiveCamera] = useState(null);
  const [selectedCameraDetail, setSelectedCameraDetail] = useState(null);

  const queryParams = useMemo(
    () => ({
      page: 1,
      limit: 10,
    }),
    []
  );

  const { cameras, loading, error } = useCameras(queryParams);

  const handleCameraClick = (camera) => {
    setSelectedCameraDetail(camera);
  };

  const handleCloseDetail = () => {
    setSelectedCameraDetail(null);
  };

  return (
    <div className="h-full w-full p-4">
      <CameraHeader
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        camera={cameras}
        loading={loading}
      />

      <div className="px-20">
        {loading && <Loading />}

        {error && <ErrorComponent message={error} />}
        {!loading && !error && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cameras
              .filter((camera) =>
                camera.link.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((camera) => (
                <div
                  key={camera._id}
                  onClick={() => handleCameraClick(camera)}
                  className="aspect-video cursor-pointer transition-transform hover:scale-105"
                >
                  <CameraCard
                    videoUrl={camera.link}
                    isActive={activeCamera === camera._id}
                    longitude={camera.longitude}
                    latitude={camera.latitude}
                    onPlay={() => setActiveCamera(camera._id)}
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      <CameraDetailModal
        isOpen={!!selectedCameraDetail}
        onClose={handleCloseDetail}
      >
        {selectedCameraDetail && (
          <CameraCard
            videoUrl={selectedCameraDetail.link}
            isActive={true}
            longitude={selectedCameraDetail.longitude}
            latitude={selectedCameraDetail.latitude}
            onPlay={() => { }}
            className="h-full w-full"
          />
        )}
      </CameraDetailModal>
    </div>
  );
};

export default Camera;
