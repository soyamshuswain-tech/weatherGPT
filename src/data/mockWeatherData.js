export const weatherData = {
  location: "Bhubaneswar, Odisha",
  temperature: 29,
  condition: "Partly Cloudy",
  humidity: 78,
  windSpeed: 14,
  rainProbability: 65,
  visibility: 5,
  feelsLike: 32,
  uvIndex: 6.5,
  hourly: [
    { time: '10:00', temp: 28, rain: 20 },
    { time: '11:00', temp: 29, rain: 30 },
    { time: '12:00', temp: 31, rain: 50 },
    { time: '13:00', temp: 30, rain: 80 },
    { time: '14:00', temp: 28, rain: 90 },
    { time: '15:00', temp: 27, rain: 60 }
  ],
  daily: [
    { day: 'Mon', max: 32, min: 25, condition: 'Rain' },
    { day: 'Tue', max: 31, min: 24, condition: 'Cloudy' },
    { day: 'Wed', max: 33, min: 26, condition: 'Sunny' },
    { day: 'Thu', max: 34, min: 26, condition: 'Sunny' },
    { day: 'Fri', max: 32, min: 25, condition: 'Storm' },
    { day: 'Sat', max: 29, min: 24, condition: 'Rain' },
    { day: 'Sun', max: 30, min: 25, condition: 'Cloudy' },
  ]
};
