import { useEffect, useState } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";
import Moment from "react-moment";
import GoogleMapReact from "google-map-react";
import DayWeather from "./DayWeather";
import styles from "./WeekMonthWeather.module.css";
import WeekMonthWeatherTable from "./WeekMonthWeatherTable";
import { apiKey } from "./Config";

Moment.globalLocale = "hr";

const WeekMonthWeather = (props) => {
  const { latitude, longitude, fullAddress } = props;
  const [selectedDayData, setSelectedDayData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [chartData, setChartData] = useState({ datasets: [] });

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin`
      );
      const data = await response.json();
      if (data && data.daily) {
        const temperatures_max = data.daily.temperature_2m_max;
        const temperatures_min = data.daily.temperature_2m_min;

        const days = data.daily.time;

        const weekdays = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        const dayWithDatesList = days.map((day) => {
          const dayOfWeek = weekdays[new Date(day).getDay()];
          const formatDay = format(new Date(day), "dd/MM/yyyy");
          return `${dayOfWeek}, ${formatDay}`;
        });

        setChartData({
          labels: dayWithDatesList,
          datasets: [
            {
              label: "Max temperature",
              data: temperatures_max,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "#d45959",
              borderWidth: 1,
            },
            {
              label: "Min temperature",
              data: temperatures_min,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "rgba(75,192,192,1)",
              borderWidth: 1,
            },
          ],
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [latitude, longitude]);

  const defaultProps = {
    center: {
      lat: latitude,
      lng: longitude,
    },
    zoom: 13,
  };

  const Marker = () => {
    return (
      <>
        <div className={styles.marker} />
      </>
    );
  };

  const chartOptions = {
    onClick: (event, elements) => {
      if (elements.length > 0) {
        // Get the index of the clicked element
        console.log(elements);
        const index = elements[0].index;
        console.log(index);
        console.log(event);
        // Use the index to get the data for the clicked day
        const clickedDayData = chartData.labels[index];
        console.log(clickedDayData);
        setSelectedDayData(clickedDayData);
        setModalVisible(true);
      }
    },
  };

  return (
    <div>
      <div className={styles.chartContainer}>
        <h2 className={styles.chartTitle}>Weather Chart</h2>
        <h1>{fullAddress}</h1>
        <Line
          data={chartData}
          options={chartOptions}
          className={styles.chart}
        />
        <div className={styles.mapContainer}>
          <WeekMonthWeatherTable latitude={latitude} longitude={longitude} />
          <GoogleMapReact
            bootstrapURLKeys={{
              key: apiKey,
            }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            className={styles.map}
          >
            <Marker
              className={styles.marker}
              text={fullAddress}
              lat={latitude}
              lng={longitude}
            ></Marker>
          </GoogleMapReact>
        </div>
      </div>
      {modalVisible && (
        <DayWeather
          latitude={latitude}
          longitude={longitude}
          day={selectedDayData}
          modalVisible={modalVisible}
          fullAddress={fullAddress}
          onClose={() => setModalVisible(false)}
        />
      )}
    </div>
  );
};

export default WeekMonthWeather;
