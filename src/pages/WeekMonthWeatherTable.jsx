import { useEffect, useState } from "react";
import styles from "./WeekMonthWeatherTable.module.css";
import { format } from "date-fns";
const WeekMonthWeatherTable = ({ latitude, longitude }) => {
  const [data, setData] = useState(null);
  console.log(latitude);
  console.log(longitude);
  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,rain_sum,snowfall_sum,windspeed_10m_max&timezone=Europe%2FBerlin`
      );

      const fetchedData = await response.json();

      if (fetchedData && fetchedData.daily) {
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
    const getWeatherInfo = data.daily.weathercode.map((code) => {
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

    return (
      <table className={styles.container}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Temperature max</th>
            <th>Temperature min</th>
            <th>Weathercode</th>
            <th>Rain sum</th>
            <th>Snowfall sum</th>
            <th>Windspeed 10m</th>
            {/*             <th>UV index max</th> */}
            <th>Sunrise</th>
            <th>Sunset</th>
          </tr>
        </thead>
        <tbody>
          {data.daily.time.map((day, index) => (
            <tr key={index}>
              <td>{day ? format(new Date(day), "dd-MM") : "N/A"}</td>
              <td>
                {data.daily.temperature_2m_max[index]
                  ? data.daily.temperature_2m_max[index] +
                    data.daily_units.temperature_2m_max
                  : "N/A"}
              </td>
              <td>
                {data.daily.temperature_2m_min[index]
                  ? data.daily.temperature_2m_min[index] +
                    data.daily_units.temperature_2m_min
                  : "N/A"}
              </td>
              <td>
                {data.daily.weathercode[index]
                  ? getWeatherInfo[index].text
                  : "N/A"}
              </td>
              <td>
                {data.daily.rain_sum[index]
                  ? data.daily.rain_sum[index] + data.daily_units.rain_sum
                  : "N/A"}
              </td>
              <td>
                {data.daily.snowfall_sum[index]
                  ? data.daily.snowfall_sum[index] +
                    data.daily_units.snowfall_sum
                  : "N/A"}
              </td>
              <td>
                {data.daily.windspeed_10m_max[index]
                  ? data.daily.windspeed_10m_max[index] +
                    data.daily_units.windspeed_10m_max
                  : "N/A"}
              </td>
              {/*  <td>
                {data.daily.uv_index_max[index]
                  ? data.daily.uv_index_max[index] +
                    data.daily_units.uv_index_max
                  : "N/A"}
              </td> */}
              <td>
                {data.daily.sunrise[index]
                  ? format(new Date(data.daily.sunrise[index]), "hh:mm")
                  : "N/A"}
              </td>
              <td>
                {data.daily.sunset[index]
                  ? format(new Date(data.daily.sunset[index]), "HH:mm")
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
};

export default WeekMonthWeatherTable;
