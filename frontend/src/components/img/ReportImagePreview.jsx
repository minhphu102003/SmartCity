import React from 'react';
import { ZoomIn } from 'lucide-react'; // Biểu tượng kính lúp

const getStatusTitle = (status) => {
  if (status === true) return 'Completed';
  if (status === false) return 'Rejected';
  return 'Pending';
};

const HoverOverlay = () => (
  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
    <ZoomIn className="w-8 h-8 text-white" />
  </div>
);

const ReportImagePreview = ({
  imgs = [],
  analysisStatus,
  setSelectedImg,
}) => {
  const maxVisibleImgs = 3;
  const imgsLength = imgs.length;
  const extraImgsCount = imgsLength > maxVisibleImgs ? imgsLength - maxVisibleImgs : 0;
  const visibleImgs = imgs.slice(0, maxVisibleImgs);

  let borderColor = 'border-yellow-500';
  if (analysisStatus === true) borderColor = 'border-green-500';
  else if (analysisStatus === false) borderColor = 'border-red-500';

  return (
    <div className={`flex gap-3 overflow-hidden rounded border-4 shadow-sm ${borderColor}`}>
      {imgsLength === 1 && (
        <div
          key={visibleImgs[0]._id}
          className="relative w-full aspect-[4/3] max-h-48 group cursor-pointer"
          onClick={() => setSelectedImg(visibleImgs[0].img)}
          title={getStatusTitle(analysisStatus)}
        >
          <img
            src={visibleImgs[0].img}
            alt="Report related"
            className="object-cover rounded w-full h-full"
          />
          <HoverOverlay />
        </div>
      )}

      {imgsLength === 2 && visibleImgs.map((imgObj, idx) => (
        <div
          key={imgObj._id}
          className={`relative aspect-[4/3] max-h-48 w-1/2 group cursor-pointer ${idx === 0 ? 'rounded-l' : 'rounded-r'}`}
          onClick={() => setSelectedImg(imgObj.img)}
          title={getStatusTitle(analysisStatus)}
        >
          <img src={imgObj.img} alt="Report related" className="object-cover w-full h-full" />
          <HoverOverlay />
        </div>
      ))}

      {imgsLength >= 3 && visibleImgs.map((imgObj, idx) => {
        const isLast = idx === maxVisibleImgs - 1;
        const isFirst = idx === 0;

        return (
          <div
            key={imgObj._id}
            className={`relative aspect-[4/3] max-h-48 ${isFirst ? 'w-1/2 rounded-l' : 'w-1/4'} ${isLast ? 'rounded-r' : ''} group cursor-pointer`}
            onClick={() => setSelectedImg(imgObj.img)}
            title={getStatusTitle(analysisStatus)}
          >
            <img src={imgObj.img} alt="Report related" className="object-cover w-full h-full" />
            {isLast && extraImgsCount > 0 ? (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold">
                +{extraImgsCount}
              </div>
            ) : (
              <HoverOverlay />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ReportImagePreview;
