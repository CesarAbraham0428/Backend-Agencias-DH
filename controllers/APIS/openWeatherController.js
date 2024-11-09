const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const weatherTranslations = {
    'clear sky': 'Cielo despejado',
    'few clouds': 'Poco Nublado',
    'scattered clouds': 'Nubes dispersas',
    'broken clouds': 'Parcialmente nublado',
    'overcast clouds': 'Nublado',
    'light rain': 'Lluvia ligera',
    'moderate rain': 'Lluvia moderada',
    'heavy rain': 'Lluvia intensa',
    'thunderstorm': 'Tormenta eléctrica',
    'snow': 'Nieve',
    'mist': 'Niebla',
    'fog': 'Neblina'
};

const translateWeather = (description) => {
    return weatherTranslations[description.toLowerCase()] || description;
};

const getForecastData = async (req, res) => {
    try {
        const apiKey = process.env.CLAVE_OPENWHEATER;

        const lat = req.query.lat || 21.157037609;
        const lon = req.query.lon || -100.9335989;
                
        const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
            params: {
                lat: lat,
                lon: lon,
                appid: apiKey,
                units: 'metric'
            }
        });

        const now = new Date();
        let forecastDays = new Map();
        
        response.data.list.forEach(forecast => {
            const forecastDate = new Date(forecast.dt * 1000);
            const dayKey = forecastDate.toISOString().split('T')[0];
            
            if (forecastDate >= now) {
                if (!forecastDays.has(dayKey)) {
                    forecastDays.set(dayKey, forecast);
                } else {
                    const existingForecast = forecastDays.get(dayKey);
                    const existingHour = new Date(existingForecast.dt * 1000).getHours();
                    const newHour = forecastDate.getHours();
                    
                    if (Math.abs(12 - newHour) < Math.abs(12 - existingHour)) {
                        forecastDays.set(dayKey, forecast);
                    }
                }
            }
        });

        const filteredForecast = Array.from(forecastDays.values())
            .slice(0, 5)
            .map(forecast => ({
                dt: forecast.dt,
                date: new Date(forecast.dt * 1000).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                }),
                main: {
                    temp: Math.round(forecast.main.temp),
                    humidity: forecast.main.humidity
                },
                weather: [{
                    description: translateWeather(forecast.weather[0].description),
                    icon: forecast.weather[0].icon
                }]
            }));

        res.json({
            success: true,
            data: filteredForecast
        });

    } catch (error) {

        res.status(error.response?.status || 500).json({
            success: false,
            message: 'Error al obtener datos del clima',
            error: error.message,
            details: error.response?.data
        });
    }
};

module.exports = {
    getForecastData
};