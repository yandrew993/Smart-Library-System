import { useEffect, useState } from "react";
import apiRequest from "../lib/apiRequest";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get(url);
        console.log(`Fetching data from: ${url}`, res.data);
        setData(res.data);
      } catch (err) {
        console.error(`Error fetching data from: ${url}`, err);
        setError(err.response?.data || err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await apiRequest.get(url);
      console.log(`Re-fetching data from: ${url}`, res.data);
      setData(res.data);
    } catch (err) {
      console.error(`Error re-fetching data from: ${url}`, err);
      setError(err.response?.data || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, reFetch };
};

export default useFetch;