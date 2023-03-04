import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Autocomplete from "./pages/Autocomplete";
import WeekMonthWeather from "./pages/WeekMonthWeather";

const App = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [placeName, setPlaceName] = useState(null);
  const [fullAddress, setFullAddress] = useState(null);

  useEffect(() => {
    const storedLatitude = localStorage.getItem("latitude");
    const storedLongitude = localStorage.getItem("longitude");
    const storedAddress = localStorage.getItem("address");
    const storedCityName = localStorage.getItem("cityName");
    if (storedLatitude && storedLongitude && storedAddress && storedCityName) {
      setLatitude(parseFloat(storedLatitude));
      setLongitude(parseFloat(storedLongitude));
      setPlaceName(storedCityName);
      setFullAddress(storedAddress);
    }
  }, []);

  const handlePlaceSelect = (lat, lng, address, cityName) => {
    setLatitude(lat);
    setLongitude(lng);
    setPlaceName(cityName);
    setFullAddress(address);
    console.log(address);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          exact
          element={<Autocomplete onPlaceSelect={handlePlaceSelect} />}
        />

        {latitude && longitude && (
          <Route
            exact
            /*  path={"/city/:cityName"} */
            path="/city"
            element={
              <WeekMonthWeather
                latitude={latitude}
                longitude={longitude}
                fullAddress={fullAddress}
                placeName={placeName}
              />
            }
          />
        )}
      </Routes>
    </Router>
  );
};

export default App;
