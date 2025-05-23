import { useEffect, useRef } from "react";
import { Popup } from "react-map-gl";

const CameraPopup = ({ camera, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!camera) return null;

  const videoSrc = `${camera.link.replace("watch?v=", "embed/")}?autoplay=1`;

  return (
    <Popup
      longitude={camera.longitude}
      latitude={camera.latitude}
      closeOnClick={false}
      onClose={onClose}
      offset={[0, -20]}
    >
      <div ref={popupRef} className="w-[300px] h-[200px] relative">
        <button
          onClick={onClose}
          className="absolute top-1 right-1 text-gray-600 hover:text-red-500 font-bold z-10 bg-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
          aria-label="Close popup"
        >
          ×
        </button>
        <iframe
          src={videoSrc}
          title="Camera Video"
          allow="autoplay"
          allowFullScreen
          className="w-full h-full rounded-md"
        />
      </div>
    </Popup>
  );
};

export default CameraPopup;
