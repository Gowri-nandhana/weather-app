import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; 
import axios from "axios";
import "./Home.css";

function Home() {
  const [city, setCity] = useState("london");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [search, setSearch] = useState(true);
  const [locations, setLocations] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false); 

  useEffect(() => {
    
    axios
      .get(
        `https://api.weatherapi.com/v1/current.json?key=bb9a008bfa90456facc182702241211&q=${city}`
      )
      .then((result) => {
        setWeather(result.data);
      })
      .catch((err) => console.log(err));
  }, [city, search]);

  useEffect(() => {
    
    axios
      .get(
        `https://api.weatherapi.com/v1/forecast.json?key=bb9a008bfa90456facc182702241211&q=${city}&days=7`
      )
      .then((result) => {
        setForecast(result.data.forecast.forecastday);
      })
      .catch((err) => console.log(err));
  }, [city, search]);

  function getLocation(e) {
    const value = e.target.value;
    if (value.trim() === "") {
      setLocations([]);
      setShowSuggestions(false); 
      return;
    }

    axios
      .get(
        `https://api.weatherapi.com/v1/search.json?key=bb9a008bfa90456facc182702241211&q=${value}`
      )
      .then((result) => {
        setLocations(result.data);
        setShowSuggestions(true); 
      })
      .catch((err) => console.log(err));
  }

  function selectLocation(name) {
    setCity(name); 
    setShowSuggestions(false); 
  }

  const chartData = {
    labels: forecast.map((day) => day.date),
    datasets: [
      {
        label: "Max Temperature (°C)",
        data: forecast.map((day) => day.day.maxtemp_c),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Min Temperature (°C)",
        data: forecast.map((day) => day.day.mintemp_c),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="container">
     
      <div className="search">
        <input
          type="search"
          placeholder="Enter city name"
          onChange={getLocation}
        />
        <button onClick={() => setSearch(!search)}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>

     
      {showSuggestions && (
        <div className="location-suggestions">
          {locations.map((obj) => (
            <h1 key={obj.id} onClick={() => selectLocation(obj.name)}>
              {obj.name}
            </h1>
          ))}
        </div>
      )}

     
      <div className="weather-data">
        <div className="current-and-chart">
          
          <div className="current">
            {weather.current && (
              <div className="current-weather">
                <h2>{weather.location.name}</h2>
                <p>{weather.current.temp_c}°C</p>
                <p>{weather.current.condition.text}</p>
                <img
                  src={weather.current.condition.icon}
                  alt={weather.current.condition.text}
                />
                <p>Humidity: {weather.current.humidity}%</p>
                <p>Wind: {weather.current.wind_kph} km/h</p>
                <p>Pressure: {weather.current.pressure_mb} mb</p>
                <p>Visibility: {weather.current.vis_km} km</p>
              </div>
            )}
          </div>

         
          <div className="chart">
            {forecast.length > 0 && <Line data={chartData} />}
          </div>
        </div>

       
        <div className="forecast-details">
          {forecast.length > 0 && (
            <div className="forecast-list">
              {forecast.map((day) => (
                <div className="forecast-item" key={day.date}>
                  <h3>{day.date}</h3>
                  <p>Max: {day.day.maxtemp_c}°C</p>
                  <p>Min: {day.day.mintemp_c}°C</p>
                  <p>{day.day.condition.text}</p>
                  <img
                    src={day.day.condition.icon}
                    alt={day.day.condition.text}
                  />
                  <p>Rain: {day.day.daily_chance_of_rain}%</p>
                  <p>Humidity: {day.day.avghumidity}%</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
