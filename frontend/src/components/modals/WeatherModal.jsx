import React from 'react';
import { WiThermometer, WiDaySunny, WiCloud, WiRain } from 'react-icons/wi';
import { IoClose } from 'react-icons/io5';

const imageMap = {
  1: 'https://static.vecteezy.com/system/resources/thumbnails/020/568/608/small/heavy-rain-drop-at-the-road-surface-bokeh-background-photo.jpg',
  2: 'https://cdn2.hubspot.net/hubfs/2936356/maxresdefault.jpg',
  3: 'https://tentsupply.com/wp-content/uploads/tent-supply-windy.jpg',
};

const imageMap2 = {
  1: 'https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/1FB4/production/_132361180_gettyimages-636191628.jpg',
  2: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo12pHoOgD5krbTYivP_zldlfK_rnU795Lhg&s',
  3: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJLDZwTK750SX2YRb5ZdXOWesoGFeoJ0LIVA&s',
};

const WeatherModal = ({ onClose, weather }) => {
  let image;
  if (weather.code.length > 2) {
    image = imageMap[weather.code % 10];
  } else {
    image = imageMap2[weather.code];
  }

  const getTextColor = (temp) => {
    return temp > 20 ? 'text-black' : 'text-white';
  };

  const getWeatherIcon = (weatherCondition) => {
    if (weatherCondition.includes('Rain')) return <WiRain size={50} />;
    if (weatherCondition.includes('Clear')) return <WiDaySunny size={50} />;
    if (weatherCondition.includes('Cloud')) return <WiCloud size={50} />;
    return <WiThermometer size={50} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="relative h-[40vh] w-[30vw] rounded-lg shadow-lg overflow-hidden"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >

        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 ${getTextColor(weather?.temp)}`}>
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 rounded-full p-2 text-white hover:bg-gray-600 transition`}
          >
            <IoClose size={24} />
          </button>

          <h2 className="mb-4 flex items-center justify-center gap-2 text-center text-2xl font-bold tracking-wide">
            {getWeatherIcon(weather?.data)}
            Current Weather
          </h2>

          <p className="mt-4 mb-2 flex items-center gap-2 text-xl font-semibold">
            <WiThermometer size={30} />
            <span className={getTextColor(weather?.temp)}>Temperature: {weather?.temp}°C</span>
          </p>

          <p className="flex items-center gap-2">
            {getWeatherIcon(weather?.data)}
            {weather?.data}
          </p>

          <button
            onClick={onClose}
            className="mt-4 rounded-xl bg-gray-800 px-10 py-2 text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:bg-opacity-80 active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherModal;
