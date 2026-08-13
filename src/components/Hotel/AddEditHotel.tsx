"use client";

import React, { useEffect, useState } from "react";
import { addhotel, edithotel } from "@/api";
import { Hotel } from "./HotelList";

interface AddEditHotelProps {
  hotel: Hotel | null;
  onClose: () => void;
  onSaved: (hotel: Hotel) => void;
}

const AddEditHotel = ({ hotel, onClose, onSaved }: AddEditHotelProps) => {
  const initialState: Hotel = {
    hotelName: "",
    location: "",
    pricePerNight: 0,
    availableRooms: 0,
    amenities: "",
  };

  const [formData, setFormData] = useState<Hotel>(initialState);

  const [loading, setLoading] = useState(false);

  // ==========================================
  // IMPORTANT: LOAD HOTEL WHEN EDIT IS CLICKED
  // ==========================================

  useEffect(() => {
    if (hotel) {
      setFormData({
        id: hotel.id,
        hotelName: hotel.hotelName,
        location: hotel.location,
        pricePerNight: hotel.pricePerNight,
        availableRooms: hotel.availableRooms,
        amenities: hotel.amenities,
      });
    } else {
      setFormData(initialState);
    }
  }, [hotel]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "pricePerNight" || name === "availableRooms"
          ? Number(value)
          : value,
    }));
  };

  // ==========================================
  // SAVE / UPDATE
  // ==========================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ================================
      // UPDATE EXISTING HOTEL
      // ================================

      if (hotel?.id) {
        console.log("Updating hotel ID:", hotel.id);

        const updatedHotel = await edithotel(
          hotel.id,
          formData.hotelName,
          formData.location,
          formData.pricePerNight,
          formData.availableRooms,
          formData.amenities,
        );

        console.log("Updated hotel:", updatedHotel);

        onSaved(updatedHotel);

        alert("Hotel Updated Successfully");
      }

      // ================================
      // ADD NEW HOTEL
      // ================================
      else {
        console.log("Adding new hotel:", formData);

        const newHotel = await addhotel(
          formData.hotelName,
          formData.location,
          formData.pricePerNight,
          formData.availableRooms,
          formData.amenities,
        );

        console.log("New hotel:", newHotel);

        onSaved(newHotel);

        alert("Hotel Added Successfully");
      }

      setFormData(initialState);

      onClose();
    } catch (error: any) {
      console.error("Hotel Save Error:", error);

      console.error("Backend:", error?.response?.data);

      alert(error?.response?.data?.message || "Failed to save hotel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-black">
          {hotel ? "Edit Hotel" : "Add New Hotel"}
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="rounded bg-gray-500 px-4 py-2 text-white"
        >
          Close
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          {/* HOTEL NAME */}

          <div>
            <label className="mb-2 block font-medium text-black">Hotel Name</label>
            <input
              type="text"
              name="hotelName"
              value={formData.hotelName}
              onChange={handleChange}
              placeholder="Taj Coromandel"
              className="w-full rounded-md border p-3 text-black"
              required
            />
          </div>

          {/* LOCATION */}

          <div>
            <label className="mb-2 block font-medium text-black">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Chennai"
              className="w-full rounded-md border p-3 text-black"
              required
            />
          </div>

          {/* PRICE */}

          <div>
            <label className="mb-2 block font-medium text-black">Price Per Night</label>
            <input
              type="number"
              name="pricePerNight"
              value={formData.pricePerNight}
              onChange={handleChange}
              min="0"
              className="w-full rounded-md border p-3 text-black"
              required
            />
          </div>

          {/* ROOMS */}

          <div>
            <label className="mb-2 block font-medium text-black">Available Rooms</label>
            <input
              type="number"
              name="availableRooms"
              value={formData.availableRooms}
              onChange={handleChange}
              min="0"
              className="w-full rounded-md border p-3 text-black"
              required
            />
          </div>

          {/* AMENITIES */}

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium text-black">Amenities</label>
            <textarea
              name="amenities"
              rows={4}
              value={formData.amenities}
              onChange={handleChange}
              placeholder="Free WiFi, Swimming Pool, Gym"
              className="w-full rounded-md border p-3 text-black"
              required
              style={{resize:"none"}}
            />
          </div>
        </div>

        {/* BUTTON */}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md bg-gray-500 px-6 py-3 text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-green-600 px-6 py-3 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : hotel ? "Update Hotel" : "Add Hotel"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditHotel;
