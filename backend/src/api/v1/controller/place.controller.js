import Place from '../models/place.js';
import fs from 'fs';
import path from 'path';
import { calculateDistance } from '../services/distance.js';
import {UPLOAD_DIRECTORY} from "../constants/uploadConstants.js";

const flattenPlace = (place) => {
    return {
        id: place._id,
        type: place.type,
        name: place.name,
        star: place.star,
        img: place.img,
        status: place.status,
        timeOpen: place.timeOpen,
        timeClose: place.timeClose,
        longitude: place.location.coordinates[0], // Tách longitude
        latitude: place.location.coordinates[1]   // Tách latitude
    };
};

export const searchNearest = async (req, res, next) => {
    try {
        const { latitude, longitude, radius = 100, type, limit = 50, page = 1 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "Please provide latitude and longitude",
            });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const radiusInKm = parseFloat(radius);
        const limitResults = parseInt(limit);
        const currentPage = parseInt(page);
        const skip = (currentPage - 1) * limitResults;

        // Build the initial query
        let query = {};
        if (type) {
            query.type = type; // Filter by type if provided
        }

        // Fetch places from database
        const allPlaces = await Place.find(query);

        // Filter places within the specified radius
        const nearbyPlaces = allPlaces.filter((place) => {
            const distance = calculateDistance(
                lat,
                lon,
                place.location.coordinates[1],
                place.location.coordinates[0]
            );
            return distance <= radiusInKm;
        });

        // Sort places by distance
        nearbyPlaces.sort((a, b) => {
            const distanceA = calculateDistance(lat, lon, a.location.coordinates[1], a.location.coordinates[0]);
            const distanceB = calculateDistance(lat, lon, b.location.coordinates[1], b.location.coordinates[0]);
            return distanceA - distanceB;
        });

        // Calculate total pages and limit results for pagination
        const total = nearbyPlaces.length;
        const totalPages = Math.ceil(total / limitResults);
        const limitedPlaces = nearbyPlaces.slice(skip, skip + limitResults);

        // Flatten data
        const flatPlaces = limitedPlaces.map(flattenPlace);

        return res.status(200).json({
            success: true,
            total,
            count: flatPlaces.length,
            totalPages,
            currentPage,
            data: flatPlaces,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
};


export const createPlace = async (req, res, next) => {
    try {
        const {
            type,
            name,
            status = true, // Default status to true if not provided
            timeOpen,
            timeClose,
            longitude,
            latitude
        } = req.body;

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);


        // Get the image path from the uploaded file
        const imgPath = req.file.filename;

        // Create new place data with a default star value of 5
        const newPlaceData = {
            type,
            name,
            star: 5, // Set star to default value of 5
            location: {
                type: "Point",
                coordinates: [lon, lat]
            },
            img: imgPath, // Store image path
            status
        };

        // Add timeOpen and timeClose if provided
        if (timeOpen) newPlaceData.timeOpen = timeOpen;
        if (timeClose) newPlaceData.timeClose = timeClose;

        // Create and save the new place
        const newPlace = new Place(newPlaceData);
        const savedPlace = await newPlace.save();

        const flatPlace = flattenPlace(savedPlace);

        return res.status(200).json({
            success: true,
            data: flatPlace
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


export const updatePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            type,
            name,
            longitude,
            latitude,
            status,
            timeOpen,
            timeClose,
        } = req.body;

        // Find the place by ID
        const place = await Place.findById(id);
        if (!place) {
            return res.status(404).json({
                success: false,
                message: "Place does not exist",
            });
        }

        // Handle image update if a new file is uploaded
        if (req.file) {
            // Delete the old image if it exists
            if (place.img && !place.img.startsWith("https://")) {
                // Only attempt deletion if img is a local path (doesn't start with "https://")
                fs.unlink(path.resolve(UPLOAD_DIRECTORY + place.img), (err) => {
                    if (err) console.error(`Failed to delete old image: ${err.message}`);
                });
            }
            // Update the place with the new image path
            place.img = req.file.filename;
        }

        // Update other fields
        if (type !== undefined) place.type = type;
        if (name !== undefined) place.name = name;
        if (status !== undefined) place.status = status;
        if (timeOpen !== undefined) place.timeOpen = timeOpen;
        if (timeClose !== undefined) place.timeClose = timeClose;

        // Update coordinates if provided
        if (longitude !== undefined && latitude !== undefined) {
            const lat = parseFloat(latitude);
            const lon = parseFloat(longitude);

            // Check for duplicate coordinates
            const existingPlace = await Place.findOne({
                "location.coordinates": [lon, lat],
                _id: { $ne: id } // Exclude the current place
            });

            if (existingPlace) {
                return res.status(400).json({
                    success: false,
                    message: "A place with these coordinates already exists."
                });
            }

            place.location = {
                type: "Point",
                coordinates: [lon, lat]
            };
        }

        // Save the updated place
        const updatedPlace = await place.save();
        const flatPlace = flattenPlace(updatedPlace);

        return res.status(200).json({
            success: true,
            data: flatPlace,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


export const deletePlace = async (req, res, next) => {
    try {
        const { id } = req.params; // Get the place ID from the URL

        // Check if place exists
        const place = await Place.findById(id);
        if (!place) {
            return res.status(404).json({
                success: false,
                message: "Place không tồn tại",
            });
        }

        // Check if there's a local image to delete
        if (place.img && !place.img.startsWith("https://")) {
            fs.unlink(path.resolve(place.img), (err) => {
                if (err) {
                    console.error(`Failed to delete image: ${err.message}`);
                }
            });
        }

        // Delete the place document
        await Place.findByIdAndDelete(id);

        const flatPlace = flattenPlace(place);

        return res.status(200).json({
            success: true,
            message: "Place has been deleted successfully",
            data: flatPlace // Send details of the deleted place
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const findPlaceById = async (req, res, next) => {
    try {
        const { id } = req.params; // Lấy ID của place từ URL

        // Kiểm tra xem địa điểm có tồn tại không
        const place = await Place.findById(id);
        if (!place) {
            return res.status(404).json({
                success: false,
                message: "Place does not exist",
            });
        }

        const flatPlace = flattenPlace(place);

        // Trả về thông tin chi tiết của địa điểm đã làm phẳng
        return res.status(200).json({
            success: true,
            data: flatPlace,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};


export const findPlaceName = async (req, res, next) => {
    try {
        const { name } = req.query; // Retrieve name from query parameter
        const limit = parseInt(req.query.limit) || 10; // Limit results per page, default to 10
        const page = parseInt(req.query.page) || 1; // Page number, default to 1
        const skip = (page - 1) * limit;

        // Count total documents that match the search criteria
        const total = await Place.countDocuments({
            name: { $regex: name, $options: 'i' } // Case-insensitive regex search
        });

        // Fetch paginated results
        const places = await Place.find({
            name: { $regex: name, $options: 'i' }
        })
        .limit(limit)
        .skip(skip);

        // If no places are found
        if (places.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No places found with the provided name",
            });
        }

        const flatPlaces = places.map(flattenPlace);
        const totalPages = Math.ceil(total / limit);

        // Return response with pagination format
        return res.status(200).json({
            success: true,
            total,
            count: flatPlaces.length,
            totalPages,
            currentPage: page,
            data: flatPlaces,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};



export const updateStatusPlace = async (req, res , next) =>{
    try {
        const { id } = req.params;
        const { status } = req.body; // Truyền trạng thái mới vào body

        // Kiểm tra xem place có tồn tại không
        const place = await Place.findById(id);
        if (!place) {
            return res.status(404).json({
                success: false,
                message: "Place không tồn tại",
            });
        }

        // Cập nhật trạng thái
        place.status = status;
        const updatedPlace = await place.save();

        const flatPlace = flattenPlace(updatedPlace);

        return res.status(200).json({
            success: true,
            data: flatPlace,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}