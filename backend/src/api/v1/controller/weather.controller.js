import { Weather, WeatherCondition } from "../models/weather.js";
import axios from "axios";


function suggestClothing(temp, clouds, windSpeed, weatherCondition) {
    let suggestion = '';
    let code = 0;
    if (temp < 20) {
        suggestion = 'Wear a jacket and long pants';
        code = '1';
    } else if (temp > 30) {
        suggestion = 'Wear light and cool clothing';
        code = '2';
    } else {
        suggestion = 'Wear regular clothing';
        code = '3';
    }

    if (weatherCondition.includes('Rain') || clouds > 50 || windSpeed > 5) {
        suggestion += ', bring a raincoat or umbrella and be cautious of the wind';
        code += '1';
    } else if (weatherCondition.includes('Clear')) {
        suggestion += ', wear sunglasses and a hat';
        code += '2';
    }

    if (temp > 35 || temp < 10 || windSpeed > 10) {
        suggestion += '. It is advisable to stay indoors if not necessary.';
    }

    return { suggestion, code, temp };
}

export const getClothingSuggestion = async (req, res, next) => {
    try {
        const { longitude, latitude } = req.query;
        if (!longitude || !latitude) {
            return res.status(400).json({ success: false, message: 'Missing longitude and latitude information' });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const currentTime = Date.now() / 1000; // Current time in seconds
        const twelveHoursAgo = currentTime - 12 * 3600; // Time 12 hours ago in seconds

        // Define the query to check for existing weather data
        const query = {
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lon, lat] },
                    $maxDistance: 5000 // 1000 meters
                }
            },
            dt: { $gte: twelveHoursAgo } // Only consider entries from the last 12 hours
        };

        // Check if there's existing weather data
        const existingWeatherData = await Weather.find(query).populate("weather_conditions").sort({ dt: -1 }).limit(1);

        let suggestion, code, temp; // Declare variables here

        if (existingWeatherData.length > 0) {
            // Use the existing weather data to generate a clothing suggestion
            const latestWeather = existingWeatherData[0];
            ({ suggestion, code, temp } = suggestClothing(
                latestWeather.temp,
                latestWeather.clouds_all,
                latestWeather.wind_speed,
                latestWeather.weather_conditions[0].main
            ));
        } else {
            // Fetch new weather data from the external API
            const apikey = process.env.API_KEY;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}&units=metric`;
            const response = await axios.get(url);
            const weatherData = response.data;

            // Create and save WeatherCondition entries
            const weatherConditions = await Promise.all(
                weatherData.weather.map(async (condition) => {
                    const weatherCondition = new WeatherCondition({
                        main: condition.main,
                        description: condition.description,
                        icon: condition.icon,
                    });
                    await weatherCondition.save();
                    return weatherCondition._id;
                })
            );

            // Create and save Weather entry with geospatial data
            const weather = new Weather({
                dt: weatherData.dt,
                temp: weatherData.main.temp,
                feels_like: weatherData.main.feels_like,
                temp_min: weatherData.main.temp_min,
                temp_max: weatherData.main.temp_max,
                pressure: weatherData.main.pressure,
                humidity: weatherData.main.humidity,
                visibility: weatherData.visibility,
                wind_speed: weatherData.wind.speed,
                wind_deg: weatherData.wind.deg,
                clouds_all: weatherData.clouds.all,
                country: weatherData.sys.country,
                timezone: weatherData.timezone,
                location: {
                    type: "Point",
                    coordinates: [weatherData.coord.lon, weatherData.coord.lat]
                },
                weather_conditions: weatherConditions,
            });

            await weather.save();

            // Generate clothing suggestion
            ({ suggestion, code, temp } = suggestClothing(
                weatherData.main.temp,
                weatherData.clouds.all,
                weatherData.wind.speed,
                weatherData.weather[0].main
            ));
        }
        res.json({
            success: true,
            message: existingWeatherData.length > 0 ? 'Existing weather data used' : 'New weather data fetched and saved',
            data: suggestion,
            code: code,
            temp: temp,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getWeatherConditions = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Lấy thông tin page và limit từ query string
        const skip = (page - 1) * limit; // Tính số bản ghi cần bỏ qua

        // Lấy tất cả các điều kiện thời tiết khác nhau với phân trang
        const conditions = await WeatherCondition.find()
            .skip(skip)
            .limit(parseInt(limit)) // Ensure limit is an integer
            .exec();

        const totalConditions = await WeatherCondition.countDocuments(); // Tổng số điều kiện thời tiết

        return res.status(200).json({
            success: true,
            total: totalConditions, // Tổng số điều kiện
            count: conditions.length, // Số lượng điều kiện trả về
            totalPages: Math.ceil(totalConditions / limit), // Tổng số trang
            currentPage: parseInt(page), // Trang hiện tại
            data: conditions // Danh sách điều kiện thời tiết
        });
    } catch (error) {
        console.error("Error retrieving weather conditions:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getWeatherData = async (req, res) => {
    try {
        const { latitude, longitude, startDate, endDate, distance = 1000 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ success: false, message: "Missing latitude or longitude" });
        }

        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const maxDistance = parseInt(distance);

        // Define the base geospatial query for nearby weather
        const query = {
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lon, lat] },
                    $maxDistance: maxDistance
                }
            }
        };

        // If a date range is provided, modify the query to retrieve historical data
        if (startDate || endDate) {
            query.dt = {};
            if (startDate) {
                query.dt.$gte = new Date(startDate).getTime() / 1000;
            }
            if (endDate) {
                query.dt.$lte = new Date(endDate).getTime() / 1000;
            }
        }

        // Fetch weather data based on the query
        const weatherData = await Weather.find(query)
            .populate("weather_conditions")
            .sort({ dt: -1 })
            .exec();

        // Flatten longitude and latitude and remove the location field
        const flatWeatherData = weatherData.map(item => {
            const { coordinates } = item.location;
            const { location, ...rest } = item.toObject(); // Destructure to remove location
            return {
                ...rest,
                longitude: coordinates[0],
                latitude: coordinates[1],
            };
        });

        res.json({
            success: true,
            message: startDate || endDate
                ? "Weather history retrieved successfully"
                : "Nearby weather data retrieved successfully",
            data: flatWeatherData,
        });
    } catch (error) {
        console.error("Error retrieving weather data:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteWeatherRecord = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRecord = await Weather.findByIdAndDelete(id).populate("weather_conditions");

        if (!deletedRecord) {
            return res.status(404).json({ success: false, message: "Weather record not found" });
        }

        if (deletedRecord.weather_conditions && deletedRecord.weather_conditions.length > 0) {
            const conditionIds = deletedRecord.weather_conditions.map(condition => condition._id);
            await WeatherCondition.deleteMany({ _id: { $in: conditionIds } });
        }

        // Flatten longitude and latitude from the location field
        const { coordinates } = deletedRecord.location;
        const { location, ...flatRecord } = deletedRecord.toObject();

        res.json({
            success: true,
            message: "Weather record deleted successfully",
            data: {
                ...flatRecord,
                longitude: coordinates[0],
                latitude: coordinates[1],
            }
        });
    } catch (error) {
        console.error("Error deleting weather record:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
