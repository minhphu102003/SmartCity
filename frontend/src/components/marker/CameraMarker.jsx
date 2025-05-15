import React from 'react';
import { Marker } from 'react-map-gl';
import MapIcon from '../icons/MapIcon';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const CameraMarker = ({ camera, zoom, onSelect }) => {
	const getScaledSize = (zoom, base = 14, min = 24, max = 60) => {
		return Math.max(min, Math.min(max, base * zoom));
	};

	return (
		<Marker longitude={camera.longitude} latitude={camera.latitude}>
			<div
				onClick={() => onSelect(camera)}
				className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-yellow-200 shadow-lg transition-transform hover:scale-110 cursor-pointer"
				title={camera.name || 'Camera'}
			>
				<MapIcon
					icon={faCamera}
					className="text-orange-400 group-hover:text-orange-400"
					style={{
						fontSize: `${getScaledSize(zoom, 2.5, 20, 50)}px`,
					}}
				/>
			</div>
		</Marker>
	);
};

export default CameraMarker;
