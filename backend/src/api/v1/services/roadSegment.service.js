import RoadSegment from '../models/roadSegment.js';

export const findNearbyRoadSegments = async ({ longitude, latitude, distance, page, limit }) => {
  const lon = parseFloat(longitude);
  const lat = parseFloat(latitude);
  const dist = parseFloat(distance); 
  const skip = (page - 1) * limit;

  const earthRadius = 6378137;

  const radiusInRadians = dist / earthRadius;

  const query = {
    $or: [
      {
        start_location: {
          $geoWithin: {
            $centerSphere: [[lon, lat], radiusInRadians]
          }
        }
      },
      {
        end_location: {
          $geoWithin: {
            $centerSphere: [[lon, lat], radiusInRadians]
          }
        }
      }
    ]
  };

  const total = await RoadSegment.countDocuments(query);

  const segments = await RoadSegment.find(query)
    .populate('reports')
    .skip(skip)
    .limit(limit);

  return { segments, total };
};

export const findRoadSegmentById = async (id) => {
  const segment = await RoadSegment.findById(id).populate('reports');
  return segment;
};

export const updateRoadSegmentData = async (id, updateData) => {
  const updatedSegment = await RoadSegment.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
  return updatedSegment;
};