import { faUtensils, faHotel, faMapMarkedAlt, faLandmark } from '@fortawesome/free-solid-svg-icons';

export const PLACE_TYPES = {
  RESTAURANT: "Restaurant",
  HOTEL: "Hotel",
  TOURIST_DESTINATION: "Tourist destination",
  MUSEUM: "Museum",
};

export const PLACE_OPTIONS = [
  { name: PLACE_TYPES.RESTAURANT, icon: faUtensils },
  { name: PLACE_TYPES.HOTEL, icon: faHotel },
  { name: PLACE_TYPES.TOURIST_DESTINATION, icon: faMapMarkedAlt },
  { name: PLACE_TYPES.MUSEUM, icon: faLandmark },
];

