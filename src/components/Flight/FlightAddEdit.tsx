"use client";

import { useEffect, useState } from "react";
import { addflight, editflight } from "@/api";

interface Flight {
  id?: number;
  flightName: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
}

interface AddEditFlightProps {
  flight: Flight | null;
  setSelectedFlight: React.Dispatch<React.SetStateAction<Flight | null>>;
  onSaved?: (flight: Flight) => void;
}

const AddEditFlight = ({
  flight,
  setSelectedFlight,
  onSaved,
}: AddEditFlightProps) => {
  const emptyFlight: Flight = {
    flightName: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    price: 0,
    availableSeats: 0,
  };

  const [formData, setFormData] = useState<Flight>(emptyFlight);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (flight) {
      setFormData({
        id: flight.id,
        flightName: flight.flightName || "",
        from: flight.from || "",
        to: flight.to || "",
        departureTime: flight.departureTime || "",
        arrivalTime: flight.arrivalTime || "",
        price: flight.price || 0,
        availableSeats: flight.availableSeats || 0,
      });
    } else {
      setFormData(emptyFlight);
    }
  }, [flight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        name === "price" || name === "availableSeats" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (flight?.id) {
        const updatedFlight = await editflight(
          flight.id,
          formData.flightName,
          formData.from,
          formData.to,
          formData.departureTime,
          formData.arrivalTime,
          formData.price,
          formData.availableSeats,
        );

        console.log("Flight updated:", updatedFlight);
        alert("Flight updated successfully!");

        if (onSaved) {
          onSaved(updatedFlight);
        }
      } else {
        const newFlight = await addflight(
          formData.flightName,
          formData.from,
          formData.to,
          formData.departureTime,
          formData.arrivalTime,
          formData.price,
          formData.availableSeats,
        );

        console.log("Flight added:", newFlight);
        alert("Flight added successfully!");

        if (onSaved) {
          onSaved(newFlight);
        }
      }

      setFormData(emptyFlight);
      setSelectedFlight(null);
    } catch (error) {
      console.error("Flight Save Error:", error);
      alert("Failed to save flight.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(emptyFlight);
    setSelectedFlight(null);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {flight ? "Edit Flight" : "Add New Flight"}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {flight
            ? "Update the flight information"
            : "Add a new flight to the system"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Flight Name
            </label>

            <input
              type="text"
              name="flightName"
              value={formData.flightName}
              onChange={handleChange}
              placeholder="IndiGo 6E-201"
              required
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">From</label>
            <input
              type="text"
              name="from"
              value={formData.from}
              onChange={handleChange}
              placeholder="Chennai"
              required
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">To</label>
            <input
              type="text"
              name="to"
              value={formData.to}
              onChange={handleChange}
              placeholder="Delhi"
              required
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Departure Time
            </label>
            <input
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Arrival Time
            </label>
            <input
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              required
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700">
              Available Seats
            </label>
            <input
              type="number"
              name="availableSeats"
              value={formData.availableSeats}
              onChange={handleChange}
              min="0"
              required
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t pt-5">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="rounded-lg bg-gray-500 px-6 py-3 font-medium text-white hover:bg-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`rounded-lg px-6 py-3 font-medium text-white disabled:opacity-50 ${
              flight
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : flight ? "Update Flight" : "Add Flight"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditFlight;
