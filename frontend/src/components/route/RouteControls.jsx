import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../searchBar/SearchBar';
import ScrollableButtons from '../scrollableButtons/ScrollableButtons';

const RouteControls = ({ setStartMarker, setEndMarker }) => {
  const [buttonsData, setButtonsData] = useState([]);
  const [isRouteVisible, setIsRouteVisible] = useState(false);

  useEffect(() => {
    setButtonsData([
      { name: 'Ô tô', icon: 'faCar' },
      { name: 'Xe máy', icon: 'faBicycle' },
      { name: 'Xe bus', icon: 'faBus' },
      { name: 'Taxi VIP', icon: 'faCar' },
      { name: 'Đưa đón sân bay', icon: 'faCar' },
    ]);
  }, []);

  return (
    <AnimatePresence>
      {!isRouteVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute left-[2%] top-4 z-50 flex w-[92%] items-center gap-4"
        >
          <SearchBar onRouteClick={() => setIsRouteVisible(true)} />
          <ScrollableButtons data={buttonsData} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RouteControls;
