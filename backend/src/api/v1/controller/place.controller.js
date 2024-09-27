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