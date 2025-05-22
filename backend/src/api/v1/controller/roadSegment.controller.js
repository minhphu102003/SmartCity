import { findNearbyRoadSegments, findRoadSegmentById, updateRoadSegmentData } from '../services/roadSegment.service.js';

export const getRoadSegments = async (req, res) => {
  const { longitude, latitude, distance = 1000, page = 1, limit = 1000 } = req.query;

  try {
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'longitude and latitude query parameters are required',
      });
    }

    const { segments, total } = await findNearbyRoadSegments({
      longitude,
      latitude,
      distance,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    return res.status(200).json({
      success: true,
      total,
      count: segments.length,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: segments,
    });
  } catch (error) {
    console.error('Error fetching road segments:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export const getRoadSegmentById = async (req, res) => {
  try {
    const segment = await findRoadSegmentById(req.params.id);

    if (!segment) {
      return res.status(404).json({ success: false, message: 'Road segment not found' });
    }
    return res.status(200).json({ success: true, data: segment });
  } catch (error) {
    console.error('Error fetching road segment:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateRoadSegment = async (req, res) => {
  try {
    const { groundwater_level, roadName } = req.body;

    const updateData = {};
    updateData.groundwater_level = groundwater_level;
    updateData.roadName = roadName;

    const updatedSegment = await updateRoadSegmentData(req.params.id, updateData);

    if (!updatedSegment) {
      return res.status(404).json({ success: false, message: 'Road segment not found' });
    }

    return res.status(200).json({ success: true, data: updatedSegment });
  } catch (error) {
    console.error('Error updating road segment:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};