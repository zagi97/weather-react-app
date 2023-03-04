import React from "react";
import Autocomplete from "react-google-autocomplete";
import { useNavigate } from "react-router-dom";
import autocompleteStyle from "./Autocomplete.module.css";

function AutoComplete(props) {
  const navigate = useNavigate();

  const handlePlaceSelect = (place) => {
    const name = place.address_components.map((name) => name.long_name);
    const cityName = name[0];
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address;

    localStorage.setItem("latitude", lat);
    localStorage.setItem("longitude", lng);
    localStorage.setItem("address", address);
    localStorage.setItem("cityName", cityName);
    if (props.onPlaceSelect) {
      props.onPlaceSelect(lat, lng, address, cityName);
    }
    const queryParams = `city=${encodeURIComponent(cityName)}`;
    navigate(`/city?${queryParams}`);
    /*  navigate(`/city/${cityName}`); */
  };

  return (
    <div className={autocompleteStyle.container}>
      <h1 className={autocompleteStyle.title}>
        Enter your city to check the weather
      </h1>
      <div className={autocompleteStyle.autocomplete_container}>
        <Autocomplete
          className={autocompleteStyle.autocomplete_input}
          apiKey="AIzaSyCiX3S9iwUaOZf_HlrFM_sWBYxtQEQeXeg"
          onPlaceSelected={handlePlaceSelect}
        />
      </div>
    </div>
  );
}
export default AutoComplete;
