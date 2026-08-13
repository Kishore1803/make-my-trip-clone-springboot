import axios from "axios";

const BACKEND_URL = "http://localhost:8081";

const API = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email, password) => {
  try {
    const response = await API.post("/user/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

export const signup = async (
  firstName,
  lastName,
  phoneNumber,
  email,
  password
) => {
  try {
    const response = await API.post("/user/signup", {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Signup Error:", error);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

export const getuserbyemail = async (email) => {
  try {
    const response = await API.get("/user/email", {
      params: {
        email,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Get User Error:", error);
    throw error;
  }
};

export const editprofile = async (
  id,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  try {
    const response = await API.put(`/user/edit/${id}`, {
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    console.log("Updated User:", response.data);
    return response.data;
  } catch (error) {
    console.error("Edit Profile Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Response:", error?.response?.data);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await API.get("/admin/user");
    return response.data;
  } catch (error) {
    console.error("Get Users Error:", error);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

export const getFlights = async () => {
  try {
    const response = await API.get("/flight");
    return response.data;
  } catch (error) {
    console.error("Get Flights Error:", error);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

export const addflight = async (
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats
) => {
  try {
    const requestData = {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    };

    console.log("Sending Flight:", requestData);
    const response = await API.post(
      "/admin/flight",
      requestData
    );

    console.log("Flight Saved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Add Flight Error:", error);
    console.error(
      "Server Response:",
      error?.response?.data
    );
    console.error(
      "Status:",
      error?.response?.status
    );

    throw error;
  }
};

export const editflight = async (
  id,
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats
) => {
  try {
    const requestData = {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    };

    const response = await API.put(
      `/admin/flight/${id}`,
      requestData
    );

    return response.data;
  } catch (error) {
    console.error("Edit Flight Error:", error);
    console.error(
      "Server Response:",
      error?.response?.data
    );

    throw error;
  }
};

export const deleteflight = async (id) => {
  try {
    console.log("Deleting Flight ID:", id);
    const response = await API.delete(
      `/admin/flight/${id}`
    );

    console.log(
      "Flight Deleted:",
      response.status
    );

    return response.data;
  } catch (error) {
    console.error("Delete Flight Error:", error);
    console.error(
      "Delete Status:",
      error?.response?.status
    );
    console.error(
      "Delete Response:",
      error?.response?.data
    );

    throw error;
  }
};

export const getHotels = async () => {
  try {
    const response = await API.get("/hotel");
    return response.data;
  } catch (error) {
    console.error("Get Hotels Error:", error);
    console.error(
      "Server Response:",
      error?.response?.data
    );

    throw error;
  }
};

export const addhotel = async (
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  try {
    const requestData = {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    };

    console.log(
      "Sending Hotel:",
      requestData
    );

    const response = await API.post(
      "/admin/hotel",
      requestData
    );

    console.log(
      "Hotel Saved:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error("Add Hotel Error:", error);
    console.error(
      "Server Response:",
      error?.response?.data
    );
    console.error(
      "Status:",
      error?.response?.status
    );

    throw error;
  }
};

export const edithotel = async (
  id,
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  try {
    const requestData = {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    };

    console.log(
      "Updating Hotel:",
      id,
      requestData
    );

    const response = await API.put(
      `/admin/hotel/${id}`,
      requestData
    );

    console.log(
      "Hotel Updated:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Edit Hotel Error:",
      error
    );
    console.error(
      "Server Response:",
      error?.response?.data
    );
    console.error(
      "Status:",
      error?.response?.status
    );

    throw error;
  }
};

export const deletehotel = async (id) => {
  try {
    console.log(
      "Deleting Hotel ID:",
      id
    );

    const response = await API.delete(
      `/admin/hotel/${id}`
    );

    console.log(
      "Hotel Deleted:",
      response.status
    );

    return response.data;
  } catch (error) {
    console.error(
      "Delete Hotel Error:",
      error
    );
    console.error(
      "Delete Status:",
      error?.response?.status
    );
    console.error(
      "Delete Response:",
      error?.response?.data
    );

    throw error;
  }
};

export const handleflightbooking = async (
  userId,
  flightId,
  seats,
  price
) => {
  try {
    const response = await API.post(
      "/booking/flight",
      null,
      {
        params: {
          userId,
          flightId,
          seats,
          price,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Flight Booking Error:",
      error
    );
    console.error(
      "Server Response:",
      error?.response?.data
    );
    throw error;
  }
};

export const handlehotelbooking = async (
  userId,
  hotelId,
  rooms,
  price
) => {
  try {
    const response = await API.post(
      "/booking/hotel",
      null,
      {
        params: {
          userId,
          hotelId,
          rooms,
          price,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Hotel Booking Error:",
      error
    );
    console.error(
      "Server Response:",
      error?.response?.data
    );
    throw error;
  }
};

export default API;