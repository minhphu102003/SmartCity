import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlayCircle } from 'react-icons/fa';
import ReactPlayer from 'react-player';
import { getYoutubeThumbnail } from '../../utils/videoUtils';

const CameraVideo = ({ videoUrl, isPlaying, onPlay  }) => {
  return (
    <AnimatePresence mode="wait">
      {isPlaying ? (
        <motion.div
          key="video"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <ReactPlayer
            url={videoUrl}
            playing={true}
            controls={true}
            width="100%"
            height="200px"
            onEnded={onPlay}
            onPause={onPlay}
          />
        </motion.div>
      ) : (
        <motion.div
          key="thumbnail"
          className="relative cursor-pointer"
          onClick={onPlay}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <img
            src={getYoutubeThumbnail(videoUrl)}
            alt="Camera Thumbnail"
            className="h-[200px] w-full rounded-lg object-cover"
          />
          <FaPlayCircle className="absolute inset-0 m-auto text-white text-5xl opacity-80 hover:opacity-100 transition-opacity duration-200" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CameraVideo;
