import axios from "axios";

const FLIGHT_STATUS_URL = "http://localhost:8081";

export const getFlightStatuses = async () => {
  try {
    const response = await axios.get(
      `${FLIGHT_STATUS_URL}/api/flight-status`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Get Flight Status Error:",
      error
    );
    throw error;
  }
};

export const getFlightStatusById = async (
  flightId
) => {
  try {
    const response = await axios.get(
      `${FLIGHT_STATUS_URL}/api/flight-status/${flightId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get Flight Status By ID Error:",
      error
    );
    throw error;
  }
};

export const updateFlightStatus = async (
  flightId,
  status,
  delayMinutes,
  delayReason,
  estimatedDeparture,
  estimatedArrival
) => {
  try {
    const response = await axios.put(
      `${FLIGHT_STATUS_URL}/api/flight-status/${flightId}`,
      {
        status,
        delayMinutes,
        delayReason,
        estimatedDeparture,
        estimatedArrival,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update Flight Status Error:",
      error
    );
    throw error;
  }
};

export const trackFlight = async (
  flightId,
  userId
) => {
  try {
    const response = await axios.post(
      `${FLIGHT_STATUS_URL}/api/flight-status/${flightId}/track`,
      {
        userId,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Track Flight Error:",
      error
    );
    throw error;
  }
};


export const stopTrackingFlight = async (
  flightId,
  userId
) => {
  try {
    const response = await axios.delete(
      `${FLIGHT_STATUS_URL}/api/flight-status/${flightId}/track`,
      {
        data: {
          userId,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Stop Tracking Error:",
      error
    );
    throw error;
  }
};