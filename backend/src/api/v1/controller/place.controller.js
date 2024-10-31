import Place from '../models/place.js';
import fs from 'fs';
import path from 'path';
import { calculateDistance } from '../services/distance.js';

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
        const { latitude, longitude, radius = 100, type, limit = 50 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp latitude và longitude",
            });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const radiusInKm = parseFloat(radius);
        const limitResults = parseInt(limit);

        // Lấy các địa điểm từ cơ sở dữ liệu 
        let query = {};
        if (type) {
            query.type = type; // Thêm điều kiện lọc nếu có type
        }

        const allPlaces = await Place.find(query);

        // Lọc các địa điểm gần nhất
        const nearbyPlaces = allPlaces.filter((place) => {
            const distance = calculateDistance(
                lat,
                lon,
                place.location.coordinates[1], // Lấy latitude từ location
                place.location.coordinates[0]  // Lấy longitude từ location
            );
            return distance <= radiusInKm;
        });

        // Sắp xếp theo khoảng cách
        nearbyPlaces.sort((a, b) => {
            const distanceA = calculateDistance(lat, lon, a.location.coordinates[1], a.location.coordinates[0]);
            const distanceB = calculateDistance(lat, lon, b.location.coordinates[1], b.location.coordinates[0]);
            return distanceA - distanceB;
        });

        // Giới hạn số lượng kết quả trả về
        const limitedPlaces = nearbyPlaces.slice(0, limitResults);

        // Làm phẳng dữ liệu
        const flatPlaces = limitedPlaces.map(flattenPlace);

        return res.status(200).json({
            success: true,
            count: flatPlaces.length,
            data: flatPlaces,
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message,
        });
    }
}


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
        const imgPath = req.file.path;

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
                fs.unlink(path.resolve(place.img), (err) => {
                    if (err) console.error(`Failed to delete old image: ${err.message}`);
                });
            }
            // Update the place with the new image path
            place.img = req.file.path;
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
            message: "Place đã được xóa thành công",
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
                message: "Place không tồn tại",
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
        const { name } = req.query; // Lấy tên từ query parameter
        const limit = parseInt(req.query.limit) || 10; // Giới hạn số lượng kết quả trả về, mặc định là 10
        const page = parseInt(req.query.page) || 1; // Số trang, mặc định là 1

        // Tính toán số lượng kết quả cần bỏ qua
        const skip = (page - 1) * limit;

        // Tìm kiếm địa điểm có tên gần giống với tên đã cung cấp
        const places = await Place.find({
            name: { $regex: name, $options: 'i' } // Sử dụng regex để tìm kiếm không phân biệt chữ hoa chữ thường
        })
        .limit(limit) // Giới hạn số lượng kết quả trả về
        .skip(skip); // Bỏ qua số lượng kết quả tương ứng với trang hiện tại

        // Kiểm tra xem có địa điểm nào không
        if (places.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy địa điểm nào với tên đã cung cấp",
            });
        }

        const flatPlaces = places.map(flattenPlace);
        // Trả về danh sách địa điểm tìm thấy
        return res.status(200).json({
            success: true,
            count: places.length,
            data: flatPlaces,
            page, // Thêm thông tin trang
            limit, // Thêm thông tin giới hạn
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