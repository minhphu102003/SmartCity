import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema({
    city: {
        id: Number,
        name: String,
        coord: {
            lon: Number,
            lat: Number,
        },
        country: String,
        population: Number,
        timezone: Number
    },
    list: [{
        dt: Number,
        sunrise: Number,
        sunset: Number,
        temp: {
            day: Number,
            min: Number,
            max: Number,
            night: Number,
            eve: Number,
            morn: Number,
        },
        feels_like: {
            day: Number,
            night: Number,
            eve: Number,
            morn: Number,
        },
        weather: [{
            id: Number,
            main: String,
            description: String,
            icon: String
        }],
        pressure: Number,
        humidity: Number,
        speed: Number,
        deg: Number,
        clouds: Number,
        pop: Number
    }]
});

const Weather = mongoose.model('Weather', weatherSchema);

export default Weather;