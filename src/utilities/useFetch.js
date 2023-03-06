import { useCallback, useEffect, useState } from "react";

export const useFetch = (url) => {
  const [weatherData, setWeatherData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const response = await fetch(url);

    const data = await response.json();

    setIsLoading(false);
    setWeatherData(data);
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { isLoading, weatherData };
};
