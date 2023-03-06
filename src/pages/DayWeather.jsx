import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import WeatherDayTable from "./WeatherDayTable.jsx";
import { format } from "date-fns";

const DayWeather = ({
  latitude,
  longitude,
  day,
  modalVisible,
  onClose,
  fullAddress,
}) => {
  const [isOpen, setIsOpen] = useState(modalVisible);
  const [chartData, setChartData] = useState({ datasets: [] });
  const [currentHourIndex, setCurrentHourIndex] = useState(null); // Add state for current hour index

  useEffect(() => {
    setIsOpen(modalVisible);
  }, [modalVisible]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
    // onClose prop to update the isOpen state when the modal is closed: ++++ onClose={() => setModalVisible(false)}
  };

  console.log(day);
  const date = new Date(day);
  const formattedDate = format(date, "yyyy-dd-MM");
  /*  const date = parse(day, "EEEE, dd/MM/yyyy", new Date());
  const formattedDate = format(date, "yyyy-MM-dd");*/

  console.log(formattedDate);
  const fetchData = async () => {
    try {
      const response = await fetch(
        /*  `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&start_date=${formatDay}&end_date=${formatDay}` */
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,weathercode,windspeed_10m,winddirection_10m&timezone=auto&start_date=${formattedDate}&end_date=${formattedDate}`
      );
      const data = await response.json();
      if (data && data.hourly) {
        const day_temperatures = data.hourly.temperature_2m;

        const day_hours = data.hourly.time;
        console.log(data);

        const hoursAndMinutesArray = day_hours.map((day_hour) => {
          const date = new Date(day_hour);
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          return `${hours}:${minutes}`;
        });

        setChartData({
          labels: hoursAndMinutesArray,
          datasets: [
            {
              label: "Temperature",
              data: day_temperatures,
              backgroundColor: "rgba(75,192,192,0.2)",
              borderColor: "#d45959",
              borderWidth: 1,
            },
          ],
        });
        const currentTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        setCurrentHourIndex(currentTime);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [latitude, longitude]);

  const options = {
    plugins: {
      annotation: {
        annotations: {
          currentHour: {
            type: "line",
            mode: "vertical",
            /* scaleID: "y-axis-0", */
            value: currentHourIndex, // Use the current hour index state as the value
            /*   value: new Date().getTime(), // Use the current time as the value */
            borderColor: "red",
            borderWidth: 2,
            label: {
              content: "Current Hour",
              enabled: true,
              position: "top",
            },
          },
        },
      },
    },
  };

  const plugins = [
    {
      afterDraw: (chart) => {
        /*  if (chart.tooltip._active && chart.tooltip._active.length) {
          const activePoint = chart.tooltip._active[0];
 */
        const { ctx } = chart;
        /*   const { x } = activePoint.element; */
        const yAxis = chart.scales.y;

        if (yAxis) {
          // check that yAxis is not undefined
          const topY = yAxis.top;
          const bottomY = yAxis.bottom;
          // Only draw the line if the x-coordinate is close to the x-coordinate of the current time
          const currentTime = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          const currentX = chart.scales.x.getPixelForValue(currentTime);

          /*  if (Math.abs(currentX - x) > 10) { */
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(currentX, topY);
          ctx.lineTo(currentX, bottomY);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "#ad0000";
          ctx.stroke();
          ctx.restore();
          /*    }
          } */
        }
      },
    },
  ];

  console.log(options);

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div
          style={{
            height: "500px",
            width: "1200px",
            /*   height: "100%",
            width: "100%", */
            textAlign: "center",
            margin: "auto",
          }}
        >
          <h2>Weather Chart</h2>
          <h1>{fullAddress}</h1>
          <h2>{day}</h2>
          {chartData.datasets.length > 0 ? (
            <Line
              data={chartData}
              style={{ margin: "0 100px " }}
              type="line"
              options={options}
              plugins={plugins}
            />
          ) : (
            <p>No weather data available for this day.</p>
          )}
          <WeatherDayTable
            latitude={latitude}
            longitude={longitude}
            formattedDate={formattedDate}
          />
        </div>
      </Modal>
    </>
  );
};

export default DayWeather;
