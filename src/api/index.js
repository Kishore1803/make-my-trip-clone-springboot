import axios from "axios";

const BACKEND_URL =
  "https://make-my-trip-clone-springboot-backend.onrender.com";

const API = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// LOGIN
export const login = async (email, password) => {
  try {
    const response = await API.post("/user/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// SIGNUP
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
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// GET USER BY EMAIL
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
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// EDIT PROFILE
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
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// GET ALL USERS
export const getUsers = async () => {
  try {
    const response = await API.get("/admin/user");
    console.log("Users:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Users Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// GET ALL FLIGHTS
export const getFlights = async () => {
  try {
    const response = await API.get("/admin/flight");
    console.log("Flights received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Flights Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// ADD FLIGHT
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
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// EDIT FLIGHT
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

    console.log("Updating Flight:", id, requestData);
    const response = await API.put(
      `/admin/flight/${id}`,
      requestData
    );

    console.log("Flight Updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Edit Flight Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

export const deleteflight = async (id) => {
  try {
    console.log("Deleting Flight ID:", id);
    const response = await API.delete(
      `/admin/flight/${id}`
    );

    console.log("Flight Deleted:", response.status);
    return response.data;
  } catch (error) {
    console.error("Delete Flight Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// GET ALL HOTELS
export const getHotels = async () => {
  try {
    const response = await API.get("/hotel");
    console.log("Hotels received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Get Hotels Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// ADD HOTEL
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

    console.log("Sending Hotel:", requestData);
    const response = await API.post(
      "/admin/hotel",
      requestData
    );

    console.log("Hotel Saved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Add Hotel Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// EDIT HOTEL
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

    console.log("Updating Hotel:", id, requestData);
    const response = await API.put(
      `/admin/hotel/${id}`,
      requestData
    );

    console.log("Hotel Updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Edit Hotel Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// DELETE HOTEL
export const deletehotel = async (id) => {
  try {
    console.log("Deleting Hotel ID:", id);
    const response = await API.delete(
      `/admin/hotel/${id}`
    );

    console.log("Hotel Deleted:", response.status);
    return response.data;
  } catch (error) {
    console.error("Delete Hotel Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// BOOK FLIGHT
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

    console.log("Flight Booking:", response.data);
    return response.data;
  } catch (error) {
    console.error("Flight Booking Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// BOOK HOTEL
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
    console.log("Hotel Booking:", response.data);
    return response.data;
  } catch (error) {
    console.error("Hotel Booking Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

export default API;