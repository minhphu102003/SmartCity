import Weather from "../models/weather.js";
import axios from "axios";

function suggestClothing(temp, clouds, windSpeed, weatherCondition) {
    let suggestion = '';

    if (temp.day < 20) {
        suggestion = 'Mặc áo khoác và quần dài';
    } else if (temp.day > 30) {
        suggestion = 'Mặc quần áo nhẹ và thoáng mát';
    } else {
        suggestion = 'Mặc trang phục bình thường';
    }

    if (weatherCondition.includes('Rain') || clouds > 50 || windSpeed > 5) {
        suggestion += ', mang áo mưa hoặc dù và cẩn thận với gió';
    } else if (weatherCondition.includes('Clear')) {
        suggestion += ', đeo kính râm và mũ';
    }

    if (temp.day > 35 || temp.day < 10 || windSpeed > 10) {
        suggestion += '. Nên ở nhà nếu không cần thiết.';
    }

    return suggestion;
}


export const getClothingSuggestion = async (req, res , next) =>{
    try{
        const { lon, lat } = req.query;
        if (!lon || !lat) {
            return res.status(400).json({ success:false, message: 'Thiếu thông tin lon và lat' });
        }
        const apikey = process.env.API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=1&appid=${apikey}&units=metric`;
        const response = await axios.get(url);

        const weatherData = response.data;
        const currentWeather = weatherData.list[0];

        const weather = new Weather({
            city: weatherData.city,
            list: [currentWeather],
        });

        await weather.save();

        const suggestion = suggestClothing(
            currentWeather.temp,
            currentWeather.clouds,
            currentWeather.speed,
            currentWeather.weather[0].main
        );

        res.json({
            success: true,
            message: 'Dữ liệu thời tiết đã được lưu',
            suggestion: suggestion
        });
    }catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

