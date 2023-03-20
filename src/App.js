import React, { useEffect, useState } from "react";
import "./App.css";
import Current from "./components/Current";
import Forecast from "./components/Forecast";

const autoCompleteURL =
  "https://api.weatherapi.com/v1/search.json?key=018bddeb6f3a481ab1c62223231603&q=";
const weatherURL = (city) =>
  `https://api.weatherapi.com/v1/forecast.json?key=018bddeb6f3a481ab1c62223231603&q=${city}&days=7&aqi=no&alerts=no
  `;

function App() {
  const [city, setCity] = useState("");
  const [citysuggestion, setCitysuggestion] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [current, setCurrent] = useState();
  const [forecast, setForecast] = useState();
  const [location, setLocation] = useState("");
  const handleClick = async (clickedCity) => {
    setCity(clickedCity);
    setClicked(true);

    const resp = await fetch(weatherURL(city));
    const data = await resp.json();
    setCurrent(data.current);
    setForecast(data.forecast);
    setLocation(data.location.name);
    console.log(data);
  };
  useEffect(() => {
    const getDataAfterTimeout = setTimeout(() => {
      const fetchCitysuggestion = async () => {
        const resp = await fetch(autoCompleteURL + city);
        const data = await resp.json();
        const citysuggestionData = data.map(
          (curData) => `${curData.name},${curData.region},${curData.country}`
        );
        setCitysuggestion(citysuggestionData);
      };
      if (!clicked && city.length > 2) {
        fetchCitysuggestion();
      } else {
        setCitysuggestion([]);
        setClicked(false);
      }
    }, 1000);
    return () => clearTimeout(getDataAfterTimeout);
  }, [city]);

  return (
    <div className="App">
      <div className="header">
        <b>Azeerah Weather Report</b>
      </div>
      <div className="App_body">
        <input
          type="text"
          className="citytextbox"
          placeholder="Enter the city name"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        {citysuggestion.length > 0 && (
          <div className="suggestionWrapper">
            {citysuggestion.map((curCity, i) => (
              <div
                key={i}
                className="suggestion"
                onClick={() => handleClick(curCity)}
              >
                {curCity}
              </div>
            ))}
          </div>
        )}
        {current && <Current current={current} city={location} />}
        <div key={city}>
          {forecast && <Forecast forecast={forecast} city={location} />}
        </div>
      </div>
    </div>
  );
}
export default App;
