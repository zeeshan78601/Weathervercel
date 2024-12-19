'use client'
import React, { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
const page = () => {
  const [weather, setweather] = useState(null)
  const [city, setcity] = useState('')
  const [storedData, setstoredData] = useState([])

  useEffect(() => {
    const GetData = localStorage.getItem('savedData')
    if (GetData) {
      setstoredData(JSON.parse(GetData) || [])
    }
  }, [])

  async function DataFetch(e) {
    e.preventDefault()
    if (!city) {
      alert('Please Enter City Name')
      return
    }
    const cityExists = storedData.some((item) => item.name.toLowerCase() === city.trim().toLowerCase());
  if (cityExists) {
    <Toaster />
    toast.error("The City is already added.")
    
    return;
    
  }
    const encodedCity = encodeURIComponent(city.trim())
    const Res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
    )
    const data = await Res.json()

    if (data.cod === 200) {
      setweather(data)
      const updatedData = [...storedData, data]
      localStorage.setItem('savedData', JSON.stringify(updatedData))
      setstoredData(updatedData)
    } else {
      toast.error(`Error: ${data.message}`) // Show error message for invalid city
    }
  }
 const handleDelete = (index)=>{
  const updatedData = storedData.filter((_,i)=> i!==index)
  setstoredData(updatedData)
  localStorage.setItem('savedData',JSON.stringify(updatedData))
  
 }

  return (
   
    <div className="bg-blue-200 min-h-screen flex flex-col items-center">
      <form className="flex flex-col w-full justify-center items-center p-4 gap-4">
        <h1 className="text-3xl bg-red-300 px-4 py-2 rounded-md">Weather Forecast</h1>
        <input
          type="text"
          className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 border border-green-400 rounded-lg text-center p-2"
          placeholder="Enter City name"
          value={city}
          onChange={(e) => setcity(e.target.value)}
        />
        <button
          onClick={DataFetch}
          className="border border-blue-400 rounded-md bg-gray-300 text-xl px-6 py-2 hover:bg-gray-400"
        >
          Get Weather
        </button>

        {storedData.length > 0 ? (
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            {storedData.map((item, index) => {
              const handleCopy = (e) => {
                e.preventDefault()
                const weatherInfo = `
                  City: ${item.name}
                  Temp: ${item.main.temp}°C
                  Rain Probability: ${item.pop ? item.pop * 100 : '0'}%
                  Weather: ${item.weather[0]?.description || 'N/A'}
                `
                navigator.clipboard
                  .writeText(weatherInfo)
                  .then(() => toast.success('Copied to clipboard!'))
                  .catch((err) => alert('Failed to copy: ' + err))
              }

              return (
                
                <div
                  key={index}
                  className="border border-black rounded-lg p-4 bg-white flex flex-col justify-center items-center gap-2 shadow-md hover:shadow-lg transition-shadow duration-300"
                
                >
                  <Toaster
  position="top-right"
  reverseOrder={false}
/>
                  <h2 className="text-xl font-bold">City: {item.name}</h2>
                  <h2 className="text-lg">Temp: {item.main.temp}°C</h2>
                  <h2 className="text-lg">Rain Probability: {item.pop ? item.pop * 100 : '0'}%</h2>
                  <h2 className="text-lg">Weather: {item.weather[0]?.description || 'N/A'}</h2>
                  <button
                    onClick={handleCopy}
                    className="border rounded bg-blue-400 px-4 py-2 text-white mt-2 hover:bg-blue-500"
                  >
                    Copy
                  </button>
                  <button className="border rounded bg-red-400 px-4 py-2 text-white mt-2 hover:bg-red-500" onClick={()=>handleDelete(index)}>Delete</button>
                </div>
              )
            })}
          </div>
        ) : (
          <h1 className="text-center text-2xl mt-10">Data not available</h1>
        )}
      </form>

      <footer className="text-center text-xl mt-auto bg-blue-300 w-full py-4">
        Footer Weather Forecast &copy; 2024
      </footer>
    </div>
  )
}

export default page
