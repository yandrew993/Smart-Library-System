// src/hooks/useFetch.js

import { useEffect, useState } from "react";
import apiRequest from "../lib/apiRequest";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest.get(url);
      const contentType = res.headers["content-type"];
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Invalid content-type: ${contentType}`);
      }

      console.log(`Fetched from: ${url}`, res.data);
      setData(res.data);
    } catch (err) {
      console.error(`Fetch error at ${url}:`, err);
      setError(err.response?.data || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const reFetch = () => fetchData();

  return { data, loading, error, reFetch };
};

export default useFetch;
