import { motion } from 'framer-motion';
import {
  PLACE_OPTIONS,
} from '../../constants';
import { SearchBar } from '../searchBar';
import { ScrollableButtons } from '../scrollableButtons';
import { AuthButton } from '../button';

const TopControls = ({
  isAuth,
  userLocation,
  shouldShake,
  latestMessage,
  setIsRouteVisible,
  handleSelectLocation,
  setPlaces,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="absolute left-[2%] top-4 z-20 flex w-[95%] items-center gap-2"
    >
      <SearchBar
        onRouteClick={() => setIsRouteVisible(true)}
        onSelectLocation={handleSelectLocation}
        userLocation={userLocation}
      />
      <ScrollableButtons
        data={PLACE_OPTIONS}
        setPlaces={setPlaces}
        longitude={userLocation?.longitude}
        latitude={userLocation?.latitude}
      />
      {!isAuth && (
        <AuthButton
          onSelectLocation={handleSelectLocation}
          shouldShake={shouldShake}
          latestMessage={latestMessage}
        />
      )}
    </motion.div>
  );
};

export default TopControls;
