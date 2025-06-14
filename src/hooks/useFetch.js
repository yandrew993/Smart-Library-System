import { useEffect, useState } from "react";
import apiRequest from "../lib/apiRequest";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ensure the URL is prefixed with /api
  const normalizedUrl = url.startsWith("/api") ? url : `/api${url}`;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest.get(normalizedUrl);

      if (res?.data && typeof res.data === "object") {
        console.log(`Fetched JSON from: ${normalizedUrl}`, res.data);
        setData(res.data);
      } else {
        console.warn(`Unexpected response format from ${normalizedUrl}:`, res);
        setError("Unexpected response format");
        setData(null);
      }
    } catch (err) {
      console.error(`Error fetching from ${normalizedUrl}:`, err);
      setError(err.response?.data || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [normalizedUrl]);

  const reFetch = fetchData;

  return { data, loading, error, reFetch };
};

export default useFetch;
