import Camera from "../models/camera.js";
import RoadSegment from "../models/roadSegment.js";

const flatCameraDate = (camera) => {
    if (!camera.location || !camera.location.coordinates || camera.location.coordinates.length < 2) {
        throw new Error("Invalid camera location data");
    }
    const { coordinates } = camera.location;
    const { location, ...rest } = camera.toObject();
    const flatCameraData = {
        ...rest,
        longitude: coordinates[0],
        latitude: coordinates[1],
    }
    return flatCameraData;
}

export const getCamerasByRoadSegment = async (req, res) => {
    const { id } = req.params;
    try {
        const cameras = await Camera.find({ roadSegment_id: id });
        const flatCameras = cameras.map(flatCameraDate); // Flatten each camera data
        res.json({ success: true, data: flatCameras });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCameraById = async (req, res) => {
    const { id } = req.params;
    try {
        const camera = await Camera.findById(id).populate("roadSegment_id");
        if (!camera) return res.status(404).json({ success: false, message: "Camera not found" });

        const flatCamera = flatCameraDate(camera); // Flatten the camera data
        res.json({ success: true, data: flatCamera });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getCameras = async (req, res) => {
    const { latitude, longitude, distance = 5, limit = 10, page = 1 } = req.query;

    try {
        const parsedLimit = parseInt(limit);
        const parsedPage = parseInt(page);
        const skip = (parsedPage - 1) * parsedLimit;

        let cameras;
        let totalCameras;
        let totalPages;

        if (latitude && longitude) {
            // Define the nearby cameras query
            const nearbyCamerasQuery = {
                location: {
                    $geoWithin: {
                        $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], distance*1000 / 6378.1], // distance in radians
                    },
                },
            };

            // Fetch nearby cameras with pagination
            cameras = await Camera.find(nearbyCamerasQuery).skip(skip).limit(parsedLimit);
            
            // Count total nearby cameras
            totalCameras = await Camera.countDocuments(nearbyCamerasQuery);
        } else {
            // Fetch all cameras with pagination
            totalCameras = await Camera.countDocuments();
            cameras = await Camera.find().skip(skip).limit(parsedLimit);
        }

        // Flatten each camera data
        const flatCameras = cameras.map(flatCameraDate);

        // Calculate total pages for response
        totalPages = Math.ceil(totalCameras / parsedLimit);

        return res.status(200).json({
            success: true,
            total: totalCameras,
            totalPages,
            currentPage: parsedPage, 
            data: flatCameras, // Return the flattened camera data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error retrieving cameras." });
    }
};


export const createCamera = async (req, res) => {
    try {
      const { longitude, latitude, link, status = true, installation_date } = req.body;
  
      // Chuẩn hóa tọa độ
      const cameraCoordinates = [parseFloat(longitude), parseFloat(latitude)];
  
      // Tìm kiếm đoạn đường gần nhất trong phạm vi 10m
      const roadSegment = await RoadSegment.findOne({
        roadSegmentLine: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: cameraCoordinates,
            },
            $maxDistance: 10, // Sai số 10m
          },
        },
      });
  
      // Tạo camera mới
      const newCamera = new Camera({
        location: {
          type: "Point",
          coordinates: cameraCoordinates,
        },
        status,
        link,
        installation_date,
        roadSegments: roadSegment ? [roadSegment._id] : [], // Lưu đoạn đường nếu tìm thấy
      });
  
      const savedCamera = await newCamera.save();
  
      if (!roadSegment) {
        // Nếu không có đoạn đường, thêm vào cache
        req.cameraCache.push(savedCamera.toObject());
      }
  
      return res.status(201).json({
        success: true,
        message: "Camera created successfully",
        data: flatCameraDate(savedCamera),
      });
    } catch (err) {
      console.error("Error creating camera:", err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
};
  


export const updateCamera = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { longitude, latitude, status, installation_date, roadSegment_ids } = req.body;

        const camera = await Camera.findById(id);
        if (!camera) {
            return res.status(404).json({
                success: false,
                message: 'Camera not found',
            });
        }

        if (longitude !== undefined && latitude !== undefined) {
            camera.location = {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            };
        }

        if (status !== undefined) camera.status = status;
        if (installation_date) camera.installation_date = installation_date;

        // Kiểm tra và cập nhật mảng roadSegments
        if (roadSegment_ids) {
            const roadSegmentsExist = await RoadSegment.find({ '_id': { $in: roadSegment_ids } });
            if (roadSegmentsExist.length !== roadSegment_ids.length) {
                return res.status(404).json({
                    success: false,
                    message: 'One or more road segments not found',
                });
            }
            camera.roadSegments = roadSegment_ids; // Cập nhật roadSegments
        }

        const updatedCamera = await camera.save();

        // Update cache with the new camera data
        const index = req.cachedCameras.findIndex(c => c._id.toString() === updatedCamera._id.toString());
        if (index !== -1) {
            req.cachedCameras[index] = updatedCamera.toObject();
        }

        return res.status(200).json({
            success: true,
            message: 'Camera updated successfully',
            data: flatCameraDate(updatedCamera),
        });
    } catch (err) {
        console.error('Error updating camera:', err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


export const deleteCamera = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedCamera = await Camera.findByIdAndDelete(id);
        if (!deletedCamera) {
            return res.status(404).json({
                success: false,
                message: "Camera not found",
            });
        }

        // Remove the deleted camera from the cache
        req.cachedCameras = req.cachedCameras.filter(camera => camera._id.toString() !== id);

        return res.status(200).json({
            success: true,
            message: "Camera deleted successfully",
            data: flatCameraDate(deletedCamera),
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
