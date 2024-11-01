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
    const { latitude, longitude, distance = 1000, limit = 10, page = 1 } = req.query;

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
                        $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], distance / 6378.1], // distance in radians
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
            totalCameras,
            totalPages,
            currentPage: parsedPage,
            data: flatCameras, // Return the flattened camera data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error retrieving cameras." });
    }
};


export const createCamera = async (req, res, next) => {
    try {
        // Extract single coordinate values and other fields from request body
        const {
            longitude,
            latitude,
            status = true,
            installation_date,
            roadSegment_id,
        } = req.body;

        // Create new Camera with coordinates provided as separate longitude and latitude values
        const newCamera = new Camera({
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            status,
            installation_date,
            roadSegment_id,
        });

        // Save the camera document to the database
        const savedCamera = await newCamera.save();
        // Respond with success message and saved camera data
        return res.status(201).json({
            success: true,
            message: 'Camera created successfully',
            data: flatCameraDate(savedCamera),
        });
    } catch (err) {
        console.error('Error creating camera:', err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const updateCamera = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { longitude, latitude, status, installation_date, roadSegment_id } = req.body;

        // Find the existing camera record
        const camera = await Camera.findById(id);
        if (!camera) {
            return res.status(404).json({
                success: false,
                message: 'Camera not found',
            });
        }

        // Update location if both longitude and latitude are provided
        if (longitude !== undefined && latitude !== undefined) {
            camera.location = {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)],
            };
        }

        // Update other fields if provided
        if (status !== undefined) camera.status = status;
        if (installation_date) camera.installation_date = installation_date;

        // Check if the provided roadSegment_id exists in the RoadSegment collection
        if (roadSegment_id) {
            const roadSegmentExists = await RoadSegment.findById(roadSegment_id);
            if (!roadSegmentExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Road segment not found',
                });
            }
            camera.roadSegment_id = roadSegment_id;
        }

        // Save the updated camera document
        const updatedCamera = await camera.save();

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

        // Find and delete the camera in a single operation
        const deletedCamera = await Camera.findByIdAndDelete(id);

        // If no camera is found, return a 404 response
        if (!deletedCamera) {
            return res.status(404).json({
                success: false,
                message: "Camera not found"
            });
        }

        // Return the deleted camera data in the response
        return res.status(200).json({
            success: true,
            message: "Camera deleted successfully",
            data: flatCameraDate(deletedCamera)
        });

    } catch (err) {
        // Catch and handle any errors
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
