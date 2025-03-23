import { faClock, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

export const DEFAULT_SEARCH_HISTORY = [
  {
    id: 0,
    content: 'Vị trí hiện tại',
    icon: faMapMarkerAlt,
    isCurrentLocation: true,
  },
  { id: 1, content: 'Hà Nội', icon: faClock },
  { id: 2, content: 'TP.HCM', icon: faClock },
  { id: 3, content: 'Đà Nẵng', icon: faClock },
];
