import React from 'react'

const WeatherCard = ({ weather }) => {
  console.log("Weather data received:", weather); // Debugging to verify 'weather' data

  return (
    <div>
      {weather && Object.keys(weather).length > 0 && weather.name ? (
        <>
          <h1>City Name: {weather.name}</h1>
          <h3>Temperature: {weather.main?.temp ?? 'N/A'} °C</h3>
          <h3>Rain Probability: {weather.pop ? weather.pop * 100 : '0'}%</h3>
        </>
      ) : (
        <h1>No data available</h1>
      )}
    </div>
  )
}

export default WeatherCard
