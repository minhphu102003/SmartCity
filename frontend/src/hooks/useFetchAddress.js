import { useState, useEffect } from "react";
import { fetchAddress } from "../services/openCageService";

/**
 * 📍 Hook để lấy địa chỉ từ tọa độ (latitude, longitude)
 * @param {number|null} latitude - Vĩ độ
 * @param {number|null} longitude - Kinh độ
 * @returns {{ address: string, loading: boolean, error: string }}
 */
const useFetchAddress = (latitude, longitude) => {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!latitude || !longitude) {
      setAddress("");
      return;
    }

    const getAddress = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await fetchAddress(latitude, longitude);
        setAddress(result);
      } catch (err) {
        setError("Failed to fetch address");
      } finally {
        setLoading(false);
      }
    };

    getAddress();
  }, [latitude, longitude]);

  return { address, loading, error };
};

export default useFetchAddress;
