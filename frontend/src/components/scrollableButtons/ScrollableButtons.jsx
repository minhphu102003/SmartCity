import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { ButtonItem } from '../button';
import { getPlace } from '../../utils/placeUtils';

const ScrollableButtons = ({ data, setPlaces, longitude, latitude }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        setCanScrollLeft(scrollRef.current.scrollLeft > 0);
        setCanScrollRight(
          scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 1
        );
      }
    };

    checkScroll();
    scrollRef.current?.addEventListener('scroll', checkScroll);
    return () => scrollRef.current?.removeEventListener('scroll', checkScroll);
  }, []);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 100, behavior: 'smooth' });
    }
  };

  const handleButtonClick = async (type) => {
    console.log(longitude);
    console.log(latitude);
    const places = await getPlace(latitude, longitude, type);
    if (places) setPlaces(places);
  };

  return (
    <div className="relative ml-[4%] flex-1 overflow-hidden sm:block hidden">
      {canScrollLeft && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-gray-300 p-2 shadow-md hover:bg-gray-400"
          onClick={() => handleScroll(-1)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      )}

      <div ref={scrollRef} className="scrollbar-hide flex gap-3 overflow-x-auto whitespace-nowrap transition-all duration-300">
        {data.map((item, index) => (
          <ButtonItem key={index} name={item.name} icon={item.icon} onClick={() => handleButtonClick(item.name)} />
        ))}
      </div>

      {canScrollRight && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-gray-300 px-2 py-1 shadow-md hover:bg-gray-400"
          onClick={() => handleScroll(1)}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      )}
    </div>
  );
};

export default ScrollableButtons;
