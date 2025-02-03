import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ButtonItem = ({ name, icon }) => {
  return (
    <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-black shadow-md hover:bg-gray-100 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
      {icon && <FontAwesomeIcon icon={icon} />}
      <span className="overflow-hidden text-ellipsis whitespace-nowrap">{name}</span>
    </button>
  );
};

export default ButtonItem;
