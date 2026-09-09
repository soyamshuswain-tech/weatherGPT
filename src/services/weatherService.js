import { weatherData } from '../data/mockWeatherData';

export const getWeather = async (lat, lng) => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(weatherData);
    }, 500);
  });
};
