import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./Weather.css";
//images
import SearchIcon from "/assets/search.png";
import clearIcon from "/assets/sun2.png";
import snowIcon from "/assets/snowy.png";
import sunIcon from "/assets/sun.png";
import drizzleIcon from "/assets/drizzle.png";
import HeavyIcon from "/assets/heavy-rain.png";
import windIcon from "/assets/wind.png";
import humidityIcon from "/assets/humidity.png";

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
    return (
        <>
            <div className="image">
                <img src={icon} alt="image" />
            </div>
            <div className="temp">{temp}°C</div>
            <div className="location">{city}</div>
            <div className="country">{country}</div>
            <div className="cord">
                <div>
                    <span className="lat">latitude</span>
                    <span>{lat}</span>
                </div>
                <div>
                    <span className="lat">longitude</span>
                    <span>{log}</span>
                </div>
            </div>
            <div className="data-container">
                <div className="element">
                    <img src={humidityIcon} alt="humidity" className="icon" width={'50px'} />
                    <div className="data">
                        <div className="humidity-percent">{humidity}%</div>
                        <div className="text">Humidity</div>
                    </div>
                </div>
                <div className="element">
                    <img src={windIcon} alt="wind" className="icon" width={'50px'} />
                    <div className="data">
                        <div className="wind-percent">{wind} km/hr</div>
                        <div className="text">Wind Speed </div>
                    </div>
                </div>
            </div>
        </>
    );
};

WeatherDetails.propTypes = {
    icon: PropTypes.string.isRequired,
    temp: PropTypes.number.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    humidity: PropTypes.number.isRequired,
    wind: PropTypes.number.isRequired,
    lat: PropTypes.number.isRequired,
    log: PropTypes.number.isRequired,
};

function Wapp() {
    const [text, setText] = useState("chennai");
    const api_key = "60b8f6ca74a3d01ff9cbec0468b141ff";
    const [icon, setIcon] = useState(snowIcon);
    const [temp, setTemp] = useState(0);
    const [city, setCity] = useState("Chennai");
    const [country, setCountry] = useState("IN");
    const [lat, setLat] = useState(0);
    const [log, setLog] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [wind, setWind] = useState(0);
    const [cityNotFound, setCityNotFound] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const weatherIconMap = {
        "01d": clearIcon,
        "01n": clearIcon,
        "02d": sunIcon,
        "02n": sunIcon,
        "03d": drizzleIcon,
        "03n": drizzleIcon,
        "04d": drizzleIcon,
        "04n": drizzleIcon,
        "09d": HeavyIcon,
        "09n": HeavyIcon,
        "10d": HeavyIcon,
        "10n": HeavyIcon,
        "13d": snowIcon,
        "13n": snowIcon,
    };

    const search = async () => {
        setLoading(true);
        setError(null);
        setCityNotFound(false);

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error("City not found");
            }

            const data = await res.json();

            setHumidity(data.main.humidity);
            setWind(data.wind.speed);
            setTemp(Math.floor(data.main.temp));
            setCity(data.name);
            setCountry(data.sys.country);
            setLat(data.coord.lat);
            setLog(data.coord.lon);

            const weatherIconCode = data.weather[0].icon;
            setIcon(weatherIconMap[weatherIconCode] || clearIcon);
        } catch (error) {
            console.error("An error occurred:", error.message);
            setError("An error occurred while fetching weather data.");
            setCityNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCity = (e) => {
        setText(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            search();
        }
    };

    useEffect(() => {
        search();
    }, []);

    return (
        <>
            <div className="container">
                <div className="input-container">
                    <input
                        type="text"
                        className="cityInput"
                        placeholder="Search city"
                        onChange={handleCity}
                        value={text}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="search-icon" onClick={search}>
                        <img src={SearchIcon} alt="Search" width={'15px'} />
                    </div>
                </div>
                {loading && <div className="loading-message">Loading...</div>}
                {error && <div className="error-message">{error}</div>}
                {cityNotFound && <div className="city-not-found">City Not Found</div>}
                {!loading && !cityNotFound && (
                    <WeatherDetails
                        icon={icon}
                        temp={temp}
                        city={city}
                        country={country}
                        lat={lat}
                        log={log}
                        humidity={humidity}
                        wind={wind}
                    />
                )}
                <p className="copyright">
                    Designed by <span>KAVIN</span>
                </p>
            </div>
        </>
    );
}

export default Wapp;