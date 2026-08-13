"use client";

import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

import { getHotels, addhotel, deletehotel } from "@/api";

export interface Hotel {
  id?: number;
  hotelName: string;
  location: string;
  pricePerNight: number;
  availableRooms: number;
  amenities: string;
}

interface HotelListProps {
  onSelect: (hotel: Hotel) => void;
  onAdd: () => void;
}

// ======================================================
// 10 HOTELS
// ======================================================

const defaultHotels: Hotel[] = [
  {
    hotelName: "Taj Coromandel",
    location: "Chennai",
    pricePerNight: 8500,
    availableRooms: 18,
    amenities: "Free WiFi, Swimming Pool, Gym",
  },
  {
    hotelName: "ITC Grand Chola",
    location: "Chennai",
    pricePerNight: 10500,
    availableRooms: 12,
    amenities: "Spa, Free Breakfast, Airport Shuttle",
  },
  {
    hotelName: "The Leela Palace",
    location: "New Delhi",
    pricePerNight: 15000,
    availableRooms: 20,
    amenities: "Free WiFi, Pool, Spa, Restaurant",
  },
  {
    hotelName: "The Oberoi Mumbai",
    location: "Mumbai",
    pricePerNight: 14500,
    availableRooms: 35,
    amenities: "Restaurant, Spa, Parking",
  },
  {
    hotelName: "Marina Bay Sands",
    location: "Singapore",
    pricePerNight: 42000,
    availableRooms: 30,
    amenities: "Infinity Pool, Restaurant, Gym",
  },
  {
    hotelName: "Burj Al Arab",
    location: "Dubai",
    pricePerNight: 65000,
    availableRooms: 20,
    amenities: "Luxury Suite, Beach View, Spa",
  },
  {
    hotelName: "The Ritz London",
    location: "London",
    pricePerNight: 48000,
    availableRooms: 16,
    amenities: "Spa, Fine Dining, Free WiFi",
  },
  {
    hotelName: "Hilton Tokyo",
    location: "Tokyo",
    pricePerNight: 28000,
    availableRooms: 22,
    amenities: "Restaurant, Gym, Parking",
  },
  {
    hotelName: "Hotel Paris",
    location: "Paris",
    pricePerNight: 32000,
    availableRooms: 14,
    amenities: "Breakfast, Free WiFi, Laundry",
  },
  {
    hotelName: "Sydney Harbour Hotel",
    location: "Sydney",
    pricePerNight: 26000,
    availableRooms: 28,
    amenities: "Sea View, Pool, Gym",
  },
];

// ======================================================
// HOTEL LIST
// ======================================================

const HotelList = ({ onSelect, onAdd }: HotelListProps) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ====================================================
  // LOAD HOTELS
  // ====================================================

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);

      // Get hotels from MySQL
      let data = await getHotels();

      console.log("Hotels from MySQL:", data);

      // ==================================================
      // IF TABLE IS EMPTY, ADD 10 HOTELS
      // ==================================================

      if (!data || data.length === 0) {
        console.log("Hotel table is empty. Adding 10 hotels...");

        for (const hotel of defaultHotels) {
          try {
            const savedHotel = await addhotel(
              hotel.hotelName,
              hotel.location,
              hotel.pricePerNight,
              hotel.availableRooms,
              hotel.amenities,
            );

            console.log("Hotel saved:", savedHotel);
          } catch (error) {
            console.error(`Failed to add ${hotel.hotelName}:`, error);
          }
        }

        // Get the newly inserted hotels
        data = await getHotels();

        console.log("Hotels after insertion:", data);
      }

      setHotels(data || []);
    } catch (error) {
      console.error("Get Hotels Error:", error);

      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // DELETE
  // ====================================================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this hotel?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      console.log("Deleting hotel ID:", id);

      await deletehotel(id);

      setHotels((previousHotels) =>
        previousHotels.filter((hotel) => hotel.id !== id),
      );

      alert("Hotel deleted successfully");
    } catch (error: any) {
      console.error("Delete Hotel Error:", error);

      console.error("Server Response:", error?.response?.data);

      alert(error?.response?.data?.message || "Failed to delete hotel");
    } finally {
      setDeletingId(null);
    }
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return <Loader />;
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <div className="w-full rounded-xl bg-white p-6 shadow-lg">
      {/* HEADER */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">Hotel List</h2>

          <p className="mt-1 text-sm text-gray-600">Hotels stored in MySQL</p>
        </div>

        <Button
          type="button"
          onClick={onAdd}
          className="bg-blue-600 font-semibold text-white hover:bg-blue-700"
        >
          + Add Hotel
        </Button>
      </div>

      {/* TABLE */}

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-black">Hotel Name</TableHead>

              <TableHead className="font-bold text-black">Location</TableHead>

              <TableHead className="font-bold text-black">
                Price / Night
              </TableHead>

              <TableHead className="font-bold text-black">Rooms</TableHead>

              <TableHead className="font-bold text-black">Amenities</TableHead>

              <TableHead className="text-center font-bold text-black">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {hotels.length > 0 ? (
              hotels.map((hotel) => (
                <TableRow key={hotel.id}>
                  <TableCell className="font-semibold text-black">
                    {hotel.hotelName}
                  </TableCell>

                  <TableCell className="text-black">{hotel.location}</TableCell>

                  <TableCell className="font-semibold text-black">
                    ₹{hotel.pricePerNight}
                  </TableCell>

                  <TableCell className="text-black">
                    {hotel.availableRooms}
                  </TableCell>

                  <TableCell className="text-black">
                    {hotel.amenities}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center gap-2">
                      {/* EDIT */}

                      <Button
                        type="button"
                        onClick={() => {
                          console.log("Edit clicked:", hotel);

                          onSelect(hotel);
                        }}
                        className="bg-blue-600 font-semibold text-white hover:bg-blue-700"
                      >
                        Edit
                      </Button>

                      {/* DELETE */}

                      <Button
                        type="button"
                        disabled={deletingId === hotel.id}
                        onClick={() => handleDelete(hotel.id!)}
                        className="bg-red-600 font-semibold text-white hover:bg-red-700"
                      >
                        {deletingId === hotel.id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center font-semibold text-black"
                >
                  No hotels available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* TOTAL */}

      <p className="mt-4 font-semibold text-black">
        Total Hotels: {hotels.length}
      </p>
    </div>
  );
};

export default HotelList;
