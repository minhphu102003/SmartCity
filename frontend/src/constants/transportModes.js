import { faRoute, faCar, faTrain, faWalking, faBicycle, faPlane } from '@fortawesome/free-solid-svg-icons';

export const TRANSPORT_MODE_TYPES = {
  DIRECTION: 'direction',
  CAR: 'car',
  TRAIN: 'train',
  WALK: 'walk',
  BICYCLE: 'bicycle',
  PLANE: 'plane',
};


export const TRANSPORT_MODE_ITEMS = [
  { key: TRANSPORT_MODE_TYPES.DIRECTION, icon: faRoute, label: 'Tìm đường' },
  { key: TRANSPORT_MODE_TYPES.CAR, icon: faCar, label: 'Ô tô' },
  { key: TRANSPORT_MODE_TYPES.TRAIN, icon: faTrain, label: 'Tàu hỏa' },
  { key: TRANSPORT_MODE_TYPES.WALK, icon: faWalking, label: 'Đi bộ' },
  { key: TRANSPORT_MODE_TYPES.BICYCLE, icon: faBicycle, label: 'Xe đạp' },
  { key: TRANSPORT_MODE_TYPES.PLANE, icon: faPlane, label: 'Máy bay' },
];
