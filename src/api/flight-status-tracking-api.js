import axios from "axios";

const API_URL = "https://make-my-trip-clone-springboot-backend.onrender.com";

// Get all flight statuses
export const getFlightStatus = async () => {
  const response = await axios.get(`${API_URL}/api/flight-status`);
  return response.data;
};

// Get one flight status
export const getFlightStatusById = async (flightId) => {
  const response = await axios.get(`${API_URL}/api/flight-status/${flightId}`);
  return response.data;
};

// Simulate flight status
export const simulateFlightStatus = async (flightId) => {
    const response = await axios.put(`${API_URL}/api/flight-status/${flightId}/simulate`);
    return response.data;
};

// Track flight
export const trackFlight = async (flightId, userId, status) => {
  const response = await axios.post(`${API_URL}/api/flight-tracking`,
    {
      flightId: flightId,
      status: status
    }
  );
  return response.data;
};

// Stop tracking flight
export const stopTrackingFlight = async (flightId) => {
  const response = await axios.delete(`${API_URL}/api/flight-tracking/${flightId}`);
  return response.data;
};

// Get tracked flights
export const getTrackedFlights = async () => {
  const response = await axios.get(`${API_URL}/api/flight-tracking`);
  return response.data;
};