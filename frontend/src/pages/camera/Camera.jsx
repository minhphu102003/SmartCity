import React, { useState, useMemo } from "react";
import CameraCard from "../../components/card/CameraCard";
import CameraHeader from "../../components/card/CameraHeader";
import useCameras from "../../hooks/useCameras";
import Loading from "../../components/common/Loading";
import ErrorComponent from "../../components/common/ErrorComponent";
import { CITIES } from '../../constants';
import CameraDetailModal from "../../components/modals/CameraDetailModal";

const Camera = () => {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCamera, setActiveCamera] = useState(null);
  const [selectedCameraDetail, setSelectedCameraDetail] = useState(null);

  const queryParams = useMemo(() => ({
    page: 1,
    limit: 10,
  }), []); 

  const { cameras, loading, error } = useCameras(queryParams);

  const handleCameraClick = (camera) => {
    setSelectedCameraDetail(camera);
  };

  const handleCloseDetail = () => {
    setSelectedCameraDetail(null);
  };

  return (
    <div className="w-full h-full p-4">
      <CameraHeader
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="px-20">
        {loading && <Loading />}

        {error && <ErrorComponent message={error} />}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
            {cameras
              .filter((camera) => camera.link.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((camera) => (
                <div
                  key={camera._id}
                  onClick={() => handleCameraClick(camera)}
                  className="cursor-pointer transition-transform hover:scale-105 aspect-video"
                >
                  <CameraCard
                    videoUrl={camera.link}
                    isActive={activeCamera === camera._id}
                    onPlay={() => setActiveCamera(camera._id)}
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Camera Detail Modal */}
      <CameraDetailModal
        isOpen={!!selectedCameraDetail}
        onClose={handleCloseDetail}
      >
        {selectedCameraDetail && (
          <CameraCard
            videoUrl={selectedCameraDetail.link}
            isActive={true}
            onPlay={() => {}}
            className="w-full h-full"
          />
        )}
      </CameraDetailModal>
    </div>
  );
};

export default Camera;
