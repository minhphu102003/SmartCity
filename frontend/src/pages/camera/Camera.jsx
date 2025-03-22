import React, { useState, useMemo } from "react";
import CameraCard from "../../components/card/CameraCard";
import CameraHeader from "../../components/card/CameraHeader";
import useCameras from "../../hooks/useCameras";
import Loading from "../../components/common/Loading";
import ErrorComponent from "../../components/common/ErrorComponent";
import {CITIES} from '../../constants';

const Camera = () => {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCamera, setActiveCamera] = useState(null);

  const queryParams = useMemo(() => ({
    page: 1,
    limit: 10,
  }), []); 

  const { cameras, loading, error } = useCameras(queryParams);

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
          <div className="flex items-center justify-start flex-wrap gap-4 mt-4">
            {cameras
              .filter((camera) => camera.link.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((camera) => (
                <CameraCard
                  key={camera._id}
                  videoUrl={camera.link}
                  isActive={activeCamera === camera._id}
                  onPlay={() => setActiveCamera(camera._id)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Camera;
