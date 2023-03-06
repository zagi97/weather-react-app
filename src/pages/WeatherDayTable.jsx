import { useEffect, useState } from "react";

const WeatherDayTable = ({ latitude, longitude, formattedDate }) => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m&start_date=${formattedDate}&end_date=${formattedDate}`
      );
      const fetchedData = await response.json();
      if (fetchedData && fetchedData.hourly) {
        setData(fetchedData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [latitude, longitude]);

  // Check if data is null, and display a loading indicator if it is
  if (!data) {
    return <div>Loading...</div>;
  } else {
    const getWeatherInfo = data.hourly.weathercode.map((code) => {
      switch (code) {
        case 0:
          return { text: "Clear sky", image: "clear-sky.png" };
        case 1:
        case 2:
        case 3:
          return { text: "Partly cloudy", image: "partly-cloudy.png" };
        case 45:
        case 48:
          return { text: "Fog", image: "fog.png" };
        case 51:
        case 53:
        case 55:
          return { text: "Drizzle", image: "drizzle.png" };
        case 56:
        case 57:
          return { text: "Freezing drizzle", image: "freezing-drizzle.png" };
        case 61:
        case 63:
        case 65:
          return { text: "Rain", image: "rain.png" };
        case 66:
        case 67:
          return { text: "Freezing rain", image: "freezing-rain.png" };
        case 71:
        case 73:
        case 75:
          return { text: "Snow", image: "snow.png" };
        case 77:
          return { text: "Snow grains", image: "snow-grains.png" };
        case 80:
        case 81:
        case 82:
          return { text: "Rain showers", image: "rain-showers.png" };
        case 85:
        case 86:
          return { text: "Snow showers", image: "snow-showers.png" };
        case 95:
          return { text: "Thunderstorm", image: "thunderstorm.png" };
        case 96:
        case 99:
          return {
            text: "Thunderstorm with hail",
            image: "thunderstorm-with-hail.png",
          };
        default:
          return { text: "Unknown weather", image: "unknown.png" };
      }
    });

    const directions = [
      "north",
      "northeast",
      "east",
      "southeast",
      "south",
      "southwest",
      "west",
      "northwest",
    ];
    const getWindDirection_10mInfo = data.hourly.winddirection_10m.map(
      (winddirection) => {
        const index = Math.round(winddirection / 45) % 8;
        return directions[index];
      }
    );

    return (
      <table style={{ margin: "auto" }}>
        <thead>
          <tr>
            <th>Hour</th>
            <th>Relative Humidity</th>
            <th>Apparent Temperature</th>
            <th>Weathercode</th>
            <th>Windspeed 10m</th>
            <th>Winddirection 10m</th>
          </tr>
        </thead>
        <tbody>
          {data.hourly.time.map((hour, index) => (
            <tr key={index}>
              <td>{hour ? hour.slice(11, 13) + ":00" : "N/A"}</td>
              <td>
                {data.hourly.relativehumidity_2m[index]
                  ? data.hourly.relativehumidity_2m[index] +
                    data.hourly_units.relativehumidity_2m
                  : "N/A"}
              </td>
              <td>
                {data.hourly.apparent_temperature[index]
                  ? data.hourly.apparent_temperature[index] +
                    data.hourly_units.apparent_temperature
                  : "N/A"}
              </td>
              <td>
                {data.hourly.weathercode[index]
                  ? getWeatherInfo[index].text
                  : "N/A"}
              </td>
              <td>
                {data.hourly.windspeed_10m[index]
                  ? data.hourly.windspeed_10m[index] +
                    data.hourly_units.windspeed_10m
                  : "N/A"}
              </td>
              <td>
                {data.hourly.winddirection_10m[index]
                  ? getWindDirection_10mInfo[index] /* +
                    data.hourly_units.winddirection_10m */
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
};

export default WeatherDayTable;
