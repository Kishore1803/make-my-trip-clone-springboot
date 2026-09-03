import axios from "axios";

const BACKEND_URL = "https://make-my-trip-clone-springboot-backend.onrender.com";

const API = axios.create({
  baseURL: BACKEND_URL,
});

// ==================== USER LOGIN ====================

export const login = async (email, password) => {
  try {
    const response = await API.post("/user/login", {
      email: email,
      password: password,
    });
    return response.data;

  } catch (error) {
    console.error("Login Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// ==================== USER SIGNUP ====================

export const signup = async (
  firstName,
  lastName,
  phoneNumber,
  email,
  password
) => {
  try {
    const response = await API.post("/user/signup", {
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      password: password,
    });
    return response.data;

  } catch (error) {
    console.error("Signup Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// ==================== GET USER BY EMAIL ====================

export const getuserbyemail = async (email) => {
  try {
    const response = await API.get("/user/email", {
      params: {
        email: email,
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

// ==================== EDIT PROFILE ====================

export const editprofile = async (
  id,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  try {
    const response = await API.put(`/user/edit/${id}`, {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
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

// ==================== GET ALL USERS ====================

export const getUsers = async () => {
  try {
    const response = await API.get("/admin/user");
    console.log("Users:", response.data)
    return response.data;

  } catch (error) {
    console.error("Get Users Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// ==================== GET ALL FLIGHTS ====================

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

// ==================== ADD FLIGHT ====================

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
    const flightData = {
      flightName: flightName,
      from: from,
      to: to,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      price: price,
      availableSeats: availableSeats,
    };

    console.log("Sending Flight:", flightData);
    const response = await API.post("/admin/flight",flightData);
    console.log("Flight Saved:", response.data);
    return response.data;

  } catch (error) {
    console.error("Add Flight Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// ==================== EDIT FLIGHT ====================

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
    const flightData = {
      flightName: flightName,
      from: from,
      to: to,
      departureTime: departureTime,
      arrivalTime: arrivalTime,
      price: price,
      availableSeats: availableSeats,
    };

    console.log("Updating Flight:", id, flightData);
    const response = await API.put(`/admin/flight/${id}`, flightData);
    console.log("Flight Updated:", response.data);
    return response.data;

  } catch (error) {
    console.error("Edit Flight Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// ==================== DELETE FLIGHT ====================

export const deleteflight = async (id) => {
  try {
    console.log("Deleting Flight ID:", id);
    const response = await API.delete(`/admin/flight/${id}`);
    console.log("Flight Deleted:", response.status);
    return response.data;

  } catch (error) {
    console.error("Delete Flight Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// ==================== GET ALL HOTELS ====================

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

// ==================== ADD HOTEL ====================

export const addhotel = async (
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  try {
    const hotelData = {
      hotelName: hotelName,
      location: location,
      pricePerNight: pricePerNight,
      availableRooms: availableRooms,
      amenities: amenities,
    };

    console.log("Sending Hotel:", hotelData);
    const response = await API.post("/admin/hotel",hotelData);
    console.log("Hotel Saved:", response.data);
    return response.data;

  } catch (error) {
    console.error("Add Hotel Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// ==================== EDIT HOTEL ====================

export const edithotel = async (
  id,
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  try {
    const hotelData = {
      hotelName: hotelName,
      location: location,
      pricePerNight: pricePerNight,
      availableRooms: availableRooms,
      amenities: amenities,
    };

    console.log("Updating Hotel:", id, hotelData);
    const response = await API.put(`/admin/hotel/${id}`, hotelData);
    console.log("Hotel Updated:", response.data);
    return response.data; 

  } catch (error) {
    console.error("Edit Hotel Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// ==================== DELETE HOTEL ====================

export const deletehotel = async (id) => {
  try {
    console.log("Deleting Hotel ID:", id);
    const response = await API.delete(`/admin/hotel/${id}`);
    console.log("Hotel Deleted:", response.status);
    return response.data;

  } catch (error) {
    console.error("Delete Hotel Error:", error);
    console.error("Status:", error?.response?.status);
    console.error("Server Response:", error?.response?.data);
    throw error;
  }
};

// ==================== BOOK FLIGHT ====================

export const handleflightbooking = async (
  userId,
  flightId,
  seats,
  price
) => {
  try {
    const response = await API.post("/booking/flight",
      null,
      {
        params: {
          userId: userId,
          flightId: flightId,
          seats: seats,
          price: price,
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

// ==================== BOOK HOTEL ====================

export const handlehotelbooking = async (
  userId,
  hotelId,
  rooms,
  price
) => {
  try {
    const response = await API.post("/booking/hotel",
      null,
      {
        params: {
          userId: userId,
          hotelId: hotelId,
          rooms: rooms,
          price: price,
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