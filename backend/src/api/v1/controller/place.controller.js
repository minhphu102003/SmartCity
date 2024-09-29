import Place from '../models/place.js';
import { calculateDistance } from '../services/distance.js';

export const searchNearest = async (req, res, next) =>{
    try{
        const {latitude, longitude, radius = 500, type = 1} = req.query;
        if(! latitude || ! longitude){
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp latitude và longitude"
            });
        }
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const radiusInKm = parseFloat(radius);

        // ! Lấy tất cả các địa điểm từ cơ sở dữ liệu 
        const allPlaces = await Place.find({type: parseInt(type)});

        // Lọc các địa điểm gần nhất
        const nearbyPlaces = allPlaces.filter((place)=>{
            const distance = calculateDistance(
                lat,
                lon,
                place.latitude,
                place.longitude
            );
            return distance <= radiusInKm;
        })

        nearbyPlaces.sort((a,b)=>{
            const distanceA = calculateDistance(lat, lon, a.latitude, a.longitude);
            const distanceB = calculateDistance(lat, lon, b.latitude, b.longitude );
            return distanceA - distanceB;
        })

        return res.status(200).json({
            success: true,
            count: nearbyPlaces.length,
            data: nearbyPlaces,
        });
    }catch(e){
        return res.status(500).json({
            success: false,
            message: e.message
        })
    }
}

export const createPlace = async (req, res, next) => {
    try {
        const {
            type,
            name,
            star,
            longitude,
            latitude,
            img,
            status = true, // Thay đổi thành Boolean
            timeOpen = null,
            timeClose = null
        } = req.body;
        // ? chưa bắt lỗi nếu 2 địa điểm có trùng kinh độ và vĩ độ 
        const typeInt = parseInt(type);
        const starFloat = parseFloat(star);
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        const newPlace = new Place({
            type: typeInt,
            name,
            star: starFloat,
            longitude: lon,
            latitude: lat,
            img,
            status,
            timeOpen,
            timeClose
        });

        const savedPlace = await newPlace.save();

        return res.status(200).json({
            success: true,
            data: savedPlace
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message // Sửa từ e.message thành err.message
        });
    }
}


export const updatePlace = async (req, res, next) => {
    try {
        const { id } = req.params; // Lấy ID của place từ URL
        const {
            type,
            name,
            longitude,
            latitude,
            img,
            status,
            timeOpen,
            timeClose
        } = req.body;

        // Kiểm tra xem place có tồn tại không
        const place = await Place.findById(id);
        if (!place) {
            return res.status(404).json({
                success: false,
                message: "Place không tồn tại",
            });
        }

        // Cập nhật các trường có thể thay đổi
        if (type !== undefined) place.type = parseInt(type);
        if (name !== undefined) place.name = name;
        if (longitude !== undefined) place.longitude = parseFloat(longitude);
        if (latitude !== undefined) place.latitude = parseFloat(latitude);
        if (img !== undefined) place.img = img;
        if (status !== undefined) place.status = status;
        if (timeOpen !== undefined) place.timeOpen = timeOpen;
        if (timeClose !== undefined) place.timeClose = timeClose;

        // Lưu các thay đổi
        const updatedPlace = await place.save();

        return res.status(200).json({
            success: true,
            data: updatedPlace,
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
        const { id } = req.params; // Lấy ID của place từ URL

        // Kiểm tra xem place có tồn tại không
        const place = await Place.findById(id);
        if (!place) {
            return res.status(404).json({
                success: false,
                message: "Place không tồn tại",
            });
        }

        // Xóa place
        await Place.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Place đã được xóa thành công",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};